"""
Data Cleaning Module for HydraSense ML Pipeline.

Parses timestamps into UTC, drops duplicate records, filters out physically INVALID data,
and preserves UNUSUAL (outlier but physically plausible) sensor readings for anomaly detection.

Outputs cleaned telemetry data to ml/data/processed/clean_sensor_readings.csv.
"""

import os
import sys
import logging
from pathlib import Path
from typing import Tuple, Dict, Any, Optional
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_RAW_PATH = BASE_DIR / "data" / "raw" / "sensor_readings.csv"
DEFAULT_CLEAN_PATH = BASE_DIR / "data" / "processed" / "clean_sensor_readings.csv"

# Documented physical sensor operating ranges
# Readings OUTSIDE these ranges are INVALID (physically impossible or hardware fail)
PHYSICAL_VALID_RANGES = {
    "ph": (0.0, 14.0),
    "turbidity": (0.0, float("inf")),
    "tds": (0.0, float("inf")),
    "temperature": (-10.0, 60.0),
}


def clean_sensor_data(
    df: pd.DataFrame,
    drop_duplicates: bool = True
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Clean raw sensor dataframe.

    Steps:
    1. Timestamp parsing & UTC normalization.
    2. Station-wise chronological sorting.
    3. Duplicate detection & removal.
    4. Physical validation (INVALID data removal).
       Note: UNUSUAL but physically valid data (e.g. high turbidity, low pH) is KEPT
       so Isolation Forest can model actual anomalies in subsequent phases.
    """
    initial_count = len(df)
    report = {"initial_count": initial_count}

    if df.empty:
        report.update({
            "duplicates_removed": 0,
            "invalid_rows_removed": 0,
            "final_count": 0
        })
        return df.copy(), report

    cleaned = df.copy()

    # 1. Timestamp parsing & UTC normalization
    cleaned["timestamp"] = pd.to_datetime(cleaned["timestamp"], utc=True, errors="coerce")
    
    # Drop rows with missing timestamp, station_code, or device_id
    cleaned = cleaned.dropna(subset=["timestamp", "station_code", "device_id"])

    # Format timestamp back to standard ISO 8601 string representation with UTC offset
    cleaned["timestamp"] = cleaned["timestamp"].dt.strftime("%Y-%m-%dT%H:%M:%SZ")

    # 2. Station-wise sorting by station_code and timestamp
    cleaned = cleaned.sort_values(by=["station_code", "timestamp"]).reset_index(drop=True)

    # 3. Duplicate detection & removal
    if drop_duplicates:
        pre_dup = len(cleaned)
        # Drop duplicates on (station_code, timestamp) keeping the first observation
        cleaned = cleaned.drop_duplicates(subset=["station_code", "timestamp"], keep="first")
        duplicates_removed = pre_dup - len(cleaned)
    else:
        duplicates_removed = 0

    report["duplicates_removed"] = duplicates_removed

    # 4. Physical range validation (Distinguish INVALID from UNUSUAL)
    # INVALID condition mask:
    invalid_mask = pd.Series(False, index=cleaned.index)

    for feature, (min_bound, max_bound) in PHYSICAL_VALID_RANGES.items():
        if feature in cleaned:
            series = pd.to_numeric(cleaned[feature], errors="coerce")
            # NaN in feature value or out of physical bounds is INVALID
            col_invalid = series.isnull() | (series < min_bound) | (series > max_bound)
            invalid_mask = invalid_mask | col_invalid

    invalid_count = int(invalid_mask.sum())
    cleaned = cleaned[~invalid_mask].reset_index(drop=True)
    report["invalid_rows_removed"] = invalid_count

    # Retain strictly the required columns
    required_cols = [
        "station_code", "device_id", "timestamp", "ph", "turbidity", "tds", "temperature"
    ]
    cleaned = cleaned[[col for col in required_cols if col in cleaned.columns]]

    report["final_count"] = len(cleaned)
    logger.info(
        "Cleaned data: initial=%d, dups_removed=%d, invalid_removed=%d, final=%d",
        initial_count, duplicates_removed, invalid_count, len(cleaned)
    )
    return cleaned, report


def run_cleaning(
    input_path: Optional[Path] = None,
    output_path: Optional[Path] = None
) -> pd.DataFrame:
    """Read raw CSV, perform cleaning, and save clean CSV."""
    src_path = Path(input_path).resolve() if input_path else DEFAULT_RAW_PATH.resolve()
    dest_path = Path(output_path).resolve() if output_path else DEFAULT_CLEAN_PATH.resolve()

    dest_path.parent.mkdir(parents=True, exist_ok=True)
    if not src_path.exists():
        logger.error("Input raw file not found at %s", src_path)
        df_empty = pd.DataFrame(columns=[
            "station_code", "device_id", "timestamp", "ph", "turbidity", "tds", "temperature"
        ])
        df_empty.to_csv(dest_path, index=False)
        return df_empty

    df_raw = pd.read_csv(str(src_path.resolve()))
    df_clean, report = clean_sensor_data(df_raw)

    dest_path.write_text(df_clean.to_csv(index=False), encoding="utf-8")
    logger.info("Saved cleaned sensor data to %s", dest_path)
    return df_clean


if __name__ == "__main__":
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_RAW_PATH
    dst = Path(sys.argv[2]) if len(sys.argv) > 2 else DEFAULT_CLEAN_PATH
    run_cleaning(src, dst)
