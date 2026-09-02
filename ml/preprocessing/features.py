"""
Feature Engineering Module for HydraSense ML Pipeline.

Adds time-based features (hour, day_of_week) and station-aware change features
(ph_change, turbidity_change, tds_change, temperature_change) computed strictly
from previous timestamps within each station to prevent future data leakage.
"""

import sys
import logging
from pathlib import Path
from typing import Optional
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_CLEAN_PATH = BASE_DIR / "data" / "processed" / "clean_sensor_readings.csv"


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Engineer time and station-aware change features for sensor dataset.

    Guarantees Data Leakage Protection:
    - Sorts dataset by station_code and timestamp.
    - Computes change features strictly as val[t] - val[t-1] within each station group.
    - Fills the first observation per station group with 0.0 change (no future context used).
    """
    if df.empty:
        df_out = df.copy()
        for col in [
            "hour", "day_of_week", "ph_change", "turbidity_change", "tds_change", "temperature_change"
        ]:
            df_out[col] = pd.Series(dtype="float64")
        return df_out

    data = df.copy()

    # 1. Parse datetime and sort chronologically per station
    data["dt_temp"] = pd.to_datetime(data["timestamp"], utc=True, errors="coerce")
    data = data.sort_values(by=["station_code", "dt_temp"]).reset_index(drop=True)

    # 2. Extract simple time features
    data["hour"] = data["dt_temp"].dt.hour
    data["day_of_week"] = data["dt_temp"].dt.dayofweek

    # 3. Station-aware change features (strictly backward looking)
    sensor_cols = ["ph", "turbidity", "tds", "temperature"]
    for col in sensor_cols:
        change_col = f"{col}_change"
        if col in data.columns:
            # Group by station_code and compute diff(1) on sorted data
            data[change_col] = (
                data.groupby("station_code")[col]
                .diff(1)
                .fillna(0.0)
            )
        else:
            data[change_col] = 0.0

    # Drop temporary datetime column used for feature extraction
    data = data.drop(columns=["dt_temp"])
    
    logger.info("Successfully engineered features. Shape: %s", data.shape)
    return data


if __name__ == "__main__":
    src_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_CLEAN_PATH
    if src_path.exists():
        df_in = pd.read_csv(src_path)
        df_fe = engineer_features(df_in)
        print("Feature Engineering Completed successfully. First 5 rows:")
        print(df_fe.head())
    else:
        print(f"File not found: {src_path}")
