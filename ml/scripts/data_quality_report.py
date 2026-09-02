"""
Data Quality Report Generator for HydraSense ML Pipeline.

Analyzes raw sensor reading CSV files and outputs a detailed terminal report
containing record counts, station coverage, date ranges, missing values, invalid values,
duplicates, and statistical summaries.
"""

import sys
import logging
from pathlib import Path
from typing import Dict, Any, Optional
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_RAW_PATH = BASE_DIR / "data" / "raw" / "sensor_readings.csv"

# Configured sensor physical valid bounds
VALID_BOUNDS = {
    "ph": (0.0, 14.0),
    "turbidity": (0.0, float("inf")),
    "tds": (0.0, float("inf")),
    "temperature": (-10.0, 60.0),
}


def generate_data_quality_report(input_path: Optional[Path] = None) -> Dict[str, Any]:
    """
    Generate a data quality dictionary and print a readable summary report to stdout.
    """
    target_path = Path(input_path) if input_path else DEFAULT_RAW_PATH
    if not target_path.exists():
        logger.error("Input data file does not exist at %s", target_path)
        print(f"ERROR: Input file not found at {target_path}")
        return {}

    df = pd.read_csv(target_path)
    if df.empty:
        print(f"Data Quality Report for {target_path.name}")
        print("=" * 60)
        print("Total Records: 0 (File is empty)")
        return {"total_records": 0}

    # Ensure timestamp parsing
    df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True, errors="coerce")

    total_records = len(df)
    num_stations = df["station_code"].nunique() if "station_code" in df else 0
    
    valid_ts = df["timestamp"].dropna()
    min_date = valid_ts.min().isoformat() if not valid_ts.empty else "N/A"
    max_date = valid_ts.max().isoformat() if not valid_ts.empty else "N/A"

    # Missing values by feature
    missing_by_feature = df.isnull().sum().to_dict()

    # Invalid values by feature based on physical sensor rules
    invalid_by_feature = {}
    for col, (min_val, max_val) in VALID_BOUNDS.items():
        if col in df:
            series = pd.to_numeric(df[col], errors="coerce")
            invalid_mask = series.isnull() | (series < min_val) | (series > max_val)
            invalid_by_feature[col] = int(invalid_mask.sum())

    # Duplicate records
    exact_duplicates = int(df.duplicated().sum())
    station_ts_duplicates = (
        int(df.duplicated(subset=["station_code", "timestamp"]).sum())
        if "station_code" in df and "timestamp" in df
        else 0
    )

    # Summary statistics for numeric features
    numeric_cols = ["ph", "turbidity", "tds", "temperature"]
    stats = {}
    for col in numeric_cols:
        if col in df:
            s = pd.to_numeric(df[col], errors="coerce").dropna()
            if not s.empty:
                stats[col] = {
                    "min": float(s.min()),
                    "max": float(s.max()),
                    "mean": float(s.mean()),
                    "std": float(s.std()) if len(s) > 1 else 0.0,
                }
            else:
                stats[col] = {"min": None, "max": None, "mean": None, "std": None}

    report = {
        "total_records": total_records,
        "num_stations": num_stations,
        "date_range": {"min": min_date, "max": max_date},
        "missing_values": missing_by_feature,
        "invalid_values": invalid_by_feature,
        "duplicate_records": {
            "exact": exact_duplicates,
            "station_timestamp": station_ts_duplicates,
        },
        "statistics": stats,
    }

    # Print terminal readable report
    print("\n" + "=" * 60)
    print("                HYDRASENSE DATA QUALITY REPORT               ")
    print("=" * 60)
    print(f"File Source:          {target_path}")
    print(f"Total Records:        {total_records}")
    print(f"Number of Stations:   {num_stations}")
    print(f"Date Range:           {min_date}  -->  {max_date}")
    print("-" * 60)
    print("MISSING VALUES BY FEATURE:")
    for col, count in missing_by_feature.items():
        pct = (count / total_records) * 100 if total_records > 0 else 0
        print(f"  - {col:<20}: {count:>6} ({pct:.2f}%)")
    print("-" * 60)
    print("INVALID PHYSICAL VALUES BY FEATURE:")
    for col, count in invalid_by_feature.items():
        pct = (count / total_records) * 100 if total_records > 0 else 0
        print(f"  - {col:<20}: {count:>6} ({pct:.2f}%)")
    print("-" * 60)
    print("DUPLICATE RECORDS:")
    print(f"  - Exact Duplicate Rows:               {exact_duplicates}")
    print(f"  - Station + Timestamp Duplicates:     {station_ts_duplicates}")
    print("-" * 60)
    print("DESCRIPTIVE STATISTICS (Valid Numbers):")
    print(f"  {'Feature':<15} {'Min':<10} {'Max':<10} {'Mean':<10} {'Std':<10}")
    print("  " + "-" * 55)
    for col, s in stats.items():
        mn = f"{s['min']:.2f}" if s["min"] is not None else "N/A"
        mx = f"{s['max']:.2f}" if s["max"] is not None else "N/A"
        avg = f"{s['mean']:.2f}" if s["mean"] is not None else "N/A"
        sd = f"{s['std']:.2f}" if s["std"] is not None else "N/A"
        print(f"  {col:<15} {mn:<10} {mx:<10} {avg:<10} {sd:<10}")
    print("=" * 60 + "\n")

    return report


if __name__ == "__main__":
    filepath = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_RAW_PATH
    generate_data_quality_report(filepath)
