"""
Chronological Data Splitting Script for HydraSense ML Pipeline.

Splits cleaned & feature-engineered telemetry dataset chronologically per station:
- 70% Train
- 15% Validation
- 15% Test

Guarantees data leakage protection:
- Data is strictly sorted by timestamp before splitting.
- No random shuffling.
- train max timestamp <= validation min timestamp <= validation max timestamp <= test min timestamp (per station).

Outputs:
- ml/data/processed/train.csv
- ml/data/processed/validation.csv
- ml/data/processed/test.csv
"""

import os
import sys
import logging
from pathlib import Path
from typing import Tuple, Optional
import pandas as pd
from ml.preprocessing.features import engineer_features

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CLEAN_PATH = BASE_DIR / "data" / "processed" / "clean_sensor_readings.csv"
PROCESSED_DIR = BASE_DIR / "data" / "processed"


def create_chronological_splits(
    df: pd.DataFrame,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Perform station-aware chronological train / validation / test split.

    Split calculation per station:
    - Sort station data chronologically by timestamp.
    - index_train = int(len(station_df) * 0.70)
    - index_val = index_train + int(len(station_df) * 0.15)
    - Train slice: [0 : index_train]
    - Val slice:   [index_train : index_val]
    - Test slice:  [index_val :]
    """
    assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Ratios must sum to 1.0"

    if df.empty:
        return df.copy(), df.copy(), df.copy()

    # Engineer features if not already present
    if "hour" not in df.columns or "ph_change" not in df.columns:
        df = engineer_features(df)

    df["dt_temp"] = pd.to_datetime(df["timestamp"], utc=True, errors="coerce")
    df = df.sort_values(by=["station_code", "dt_temp"]).reset_index(drop=True)

    train_list, val_list, test_list = [], [], []

    # Process each station group independently
    stations = df["station_code"].unique()
    for station in stations:
        station_data = df[df["station_code"] == station].sort_values(by="dt_temp").reset_index(drop=True)
        n = len(station_data)
        if n == 0:
            continue

        if n < 3:
            # If tiny dataset, put everything in train or split minimally without failing
            n_train = max(1, n - 2)
            n_val = 1 if n >= 2 else 0
        else:
            n_train = int(n * train_ratio)
            n_val = int(n * val_ratio)

        train_sub = station_data.iloc[:n_train]
        val_sub = station_data.iloc[n_train:n_train + n_val]
        test_sub = station_data.iloc[n_train + n_val:]

        train_list.append(train_sub)
        val_list.append(val_sub)
        test_list.append(test_sub)

    train_df = pd.concat(train_list, ignore_index=True) if train_list else pd.DataFrame(columns=df.columns)
    val_df = pd.concat(val_list, ignore_index=True) if val_list else pd.DataFrame(columns=df.columns)
    test_df = pd.concat(test_list, ignore_index=True) if test_list else pd.DataFrame(columns=df.columns)

    # Clean up temporary datetime column
    for d in (train_df, val_df, test_df):
        if "dt_temp" in d.columns:
            d.drop(columns=["dt_temp"], inplace=True)

    logger.info(
        "Chronological Split Complete: Train=%d (%.1f%%), Val=%d (%.1f%%), Test=%d (%.1f%%)",
        len(train_df), (len(train_df)/len(df)*100) if len(df) else 0,
        len(val_df), (len(val_df)/len(df)*100) if len(df) else 0,
        len(test_df), (len(test_df)/len(df)*100) if len(df) else 0
    )
    return train_df, val_df, test_df


def run_split_pipeline(
    input_path: Optional[Path] = None,
    output_dir: Optional[Path] = None
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """Load clean data, compute chronological splits, and save CSV files."""
    src_path = Path(input_path).resolve() if input_path else DEFAULT_CLEAN_PATH.resolve()
    out_dir = Path(output_dir).resolve() if output_dir else PROCESSED_DIR.resolve()

    out_dir_path = str(out_dir.resolve())
    os.makedirs(out_dir_path, exist_ok=True)
    if not src_path.exists():
        logger.error("Input clean data file does not exist at %s", src_path)
        empty_cols = [
            "station_code", "device_id", "timestamp", "ph", "turbidity", "tds", "temperature",
            "hour", "day_of_week", "ph_change", "turbidity_change", "tds_change", "temperature_change"
        ]
        empty_df = pd.DataFrame(columns=empty_cols)
        for fname in ["train.csv", "validation.csv", "test.csv"]:
            (out_dir / fname).write_text(empty_df.to_csv(index=False), encoding="utf-8")
        return empty_df, empty_df, empty_df

    df = pd.read_csv(str(src_path.resolve()))
    train_df, val_df, test_df = create_chronological_splits(df)

    for fname, d_split in [("train.csv", train_df), ("validation.csv", val_df), ("test.csv", test_df)]:
        (out_dir / fname).write_text(d_split.to_csv(index=False), encoding="utf-8")

    logger.info("Saved splits to %s", out_dir)
    return train_df, val_df, test_df


if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CLEAN_PATH
    run_split_pipeline(src)
