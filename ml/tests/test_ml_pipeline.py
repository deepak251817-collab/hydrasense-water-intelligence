"""
Pytest Test Suite for HydraSense ML Data Preparation Pipeline (Phase 5A).

Tests all 10 required pipeline specifications:
1. Export script
2. Missing values detected
3. Invalid pH detected
4. Negative turbidity detected
5. Negative TDS detected
6. Timestamp parsing & UTC normalization
7. Duplicate detection
8. Station-wise sorting
9. Change features do not use future data
10. Chronological train/validation/test ordering
"""

import os
from pathlib import Path
import pytest
import pandas as pd
import numpy as np

from ml.scripts.export_sensor_data import export_sensor_data
from ml.scripts.data_quality_report import generate_data_quality_report
from ml.preprocessing.clean_data import clean_sensor_data
from ml.preprocessing.features import engineer_features
from ml.scripts.create_splits import create_chronological_splits


@pytest.fixture
def sample_raw_data():
    return pd.DataFrame([
        {
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": "2026-09-01T10:00:00Z",
            "ph": 7.2,
            "turbidity": 2.5,
            "tds": 250.0,
            "temperature": 22.5,
        },
        {
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": "2026-09-01T11:00:00Z",
            "ph": 7.5,
            "turbidity": 3.0,
            "tds": 260.0,
            "temperature": 23.0,
        },
        {
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": "2026-09-01T12:00:00Z",
            "ph": 7.8,
            "turbidity": 3.5,
            "tds": 270.0,
            "temperature": 23.5,
        },
    ])


# 1. Export script test
def test_export_script(tmp_path):
    output_file = tmp_path / "sensor_readings.csv"
    # Call export_sensor_data with invalid/mock url to test graceful handling & output creation
    df = export_sensor_data(db_url="postgresql+psycopg2://invalid:invalid@localhost:5432/nonexistent", output_path=output_file)
    assert output_file.exists()
    assert isinstance(df, pd.DataFrame)
    expected_cols = ["station_code", "device_id", "timestamp", "ph", "turbidity", "tds", "temperature"]
    for col in expected_cols:
        assert col in df.columns


# 2. Missing values detected test
def test_missing_values_detected(tmp_path):
    df_missing = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": None, "turbidity": 2.5, "tds": 250.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 7.0, "turbidity": None, "tds": 250.0, "temperature": 20.0},
    ])
    raw_path = tmp_path / "raw.csv"
    df_missing.to_csv(raw_path, index=False)
    report = generate_data_quality_report(raw_path)
    assert report["missing_values"]["ph"] == 1
    assert report["missing_values"]["turbidity"] == 1


# 3. Invalid pH detected test
def test_invalid_ph_detected():
    df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": -1.5, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T12:00:00Z", "ph": 15.2, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
    ])
    cleaned_df, report = clean_sensor_data(df)
    assert report["invalid_rows_removed"] == 2
    assert len(cleaned_df) == 1
    assert cleaned_df.iloc[0]["ph"] == 7.0


# 4. Negative turbidity detected test
def test_negative_turbidity_detected():
    df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": -5.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 7.0, "turbidity": 4.2, "tds": 200.0, "temperature": 20.0},
    ])
    cleaned_df, report = clean_sensor_data(df)
    assert report["invalid_rows_removed"] == 1
    assert len(cleaned_df) == 1
    assert cleaned_df.iloc[0]["turbidity"] == 4.2


# 5. Negative TDS detected test
def test_negative_tds_detected():
    df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": -150.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 300.0, "temperature": 20.0},
    ])
    cleaned_df, report = clean_sensor_data(df)
    assert report["invalid_rows_removed"] == 1
    assert len(cleaned_df) == 1
    assert cleaned_df.iloc[0]["tds"] == 300.0


# 6. Timestamp parsing test
def test_timestamp_parsing():
    df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01 10:00:00", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
    ])
    cleaned_df, _ = clean_sensor_data(df)
    assert len(cleaned_df) == 1
    assert cleaned_df.iloc[0]["timestamp"] == "2026-09-01T10:00:00Z"


# 7. Duplicate detection test
def test_duplicate_detection():
    df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
    ])
    cleaned_df, report = clean_sensor_data(df)
    assert report["duplicates_removed"] == 1
    assert len(cleaned_df) == 1


# 8. Station-wise sorting test
def test_station_wise_sorting():
    df = pd.DataFrame([
        {"station_code": "STA-02", "device_id": "DEV-02", "timestamp": "2026-09-01T12:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T14:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
    ])
    cleaned_df, _ = clean_sensor_data(df)
    assert list(cleaned_df["station_code"]) == ["STA-01", "STA-01", "STA-02"]
    assert list(cleaned_df["timestamp"]) == ["2026-09-01T10:00:00Z", "2026-09-01T14:00:00Z", "2026-09-01T12:00:00Z"]


# 9. Change features do not use future data test
def test_change_features_no_future_data(sample_raw_data):
    df_fe = engineer_features(sample_raw_data)
    # First row change must be 0.0 (no past data available)
    assert df_fe.iloc[0]["ph_change"] == 0.0
    # Second row change: 7.5 - 7.2 = 0.3
    assert pytest.approx(df_fe.iloc[1]["ph_change"], abs=1e-5) == 0.3
    # Third row change: 7.8 - 7.5 = 0.3
    assert pytest.approx(df_fe.iloc[2]["ph_change"], abs=1e-5) == 0.3


# 10. Chronological train/validation/test ordering test
def test_chronological_splits_ordering():
    records = []
    for i in range(100):
        records.append({
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": f"2026-09-01T{i//4:02d}:{(i%4)*15:02d}:00Z",
            "ph": 7.0 + (i * 0.01),
            "turbidity": 2.0,
            "tds": 200.0,
            "temperature": 20.0,
        })
    df_large = pd.DataFrame(records)
    train_df, val_df, test_df = create_chronological_splits(df_large)

    assert len(train_df) == 70
    assert len(val_df) == 15
    assert len(test_df) == 15

    max_train_ts = train_df["timestamp"].max()
    min_val_ts = val_df["timestamp"].min()
    max_val_ts = val_df["timestamp"].max()
    min_test_ts = test_df["timestamp"].min()

    assert max_train_ts <= min_val_ts
    assert max_val_ts <= min_test_ts
