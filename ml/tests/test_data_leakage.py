"""
Explicit Data Leakage Test Suite for HydraSense ML Pipeline.

Tests:
1. Feature calculations do not use future readings (modifying future rows does not change past row features).
2. Chronological splits do not mix future data into training sets.
3. Validation and test data occur strictly after training data chronologically per station.
"""

import pytest
import pandas as pd
import numpy as np
from ml.preprocessing.features import engineer_features
from ml.scripts.create_splits import create_chronological_splits


def test_feature_engineering_no_future_leakage():
    """
    Verify that altering future observations does NOT alter past feature calculations.
    """
    df_base = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 7.5, "turbidity": 2.5, "tds": 210.0, "temperature": 21.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T12:00:00Z", "ph": 8.0, "turbidity": 3.0, "tds": 220.0, "temperature": 22.0},
    ])

    # Copy and radically change future observation (3rd row)
    df_modified_future = df_base.copy()
    df_modified_future.loc[2, "ph"] = 14.0
    df_modified_future.loc[2, "turbidity"] = 500.0

    fe_base = engineer_features(df_base)
    fe_modified = engineer_features(df_modified_future)

    # First two rows must remain EXACTLY identical
    pd.testing.assert_frame_equal(fe_base.iloc[:2], fe_modified.iloc[:2])

    # First row change features must be exactly 0.0
    assert fe_base.iloc[0]["ph_change"] == 0.0
    assert fe_base.iloc[0]["turbidity_change"] == 0.0
    assert fe_base.iloc[0]["tds_change"] == 0.0
    assert fe_base.iloc[0]["temperature_change"] == 0.0

    # Second row change features must be exactly (row1 - row0)
    assert pytest.approx(fe_base.iloc[1]["ph_change"]) == 0.5
    assert pytest.approx(fe_base.iloc[1]["turbidity_change"]) == 0.5


def test_chronological_split_no_future_in_training():
    """
    Verify that train set strictly contains earlier timestamps than validation and test sets.
    """
    records = []
    for i in range(50):
        records.append({
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": f"2026-09-01T{i//2:02d}:{(i%2)*30:02d}:00Z",
            "ph": 7.0 + (i * 0.02),
            "turbidity": 2.0 + i,
            "tds": 200.0 + i,
            "temperature": 20.0,
        })
    df = pd.DataFrame(records)

    train_df, val_df, test_df = create_chronological_splits(df)

    train_max_ts = train_df["timestamp"].max()
    val_min_ts = val_df["timestamp"].min()
    val_max_ts = val_df["timestamp"].max()
    test_min_ts = test_df["timestamp"].min()

    # Assert strict temporal precedence
    assert train_max_ts <= val_min_ts, f"Data leakage! Train max ({train_max_ts}) > Val min ({val_min_ts})"
    assert val_max_ts <= test_min_ts, f"Data leakage! Val max ({val_max_ts}) > Test min ({test_min_ts})"

    # Verify no overlap in indices / timestamps
    train_timestamps = set(train_df["timestamp"])
    val_timestamps = set(val_df["timestamp"])
    test_timestamps = set(test_df["timestamp"])

    assert len(train_timestamps.intersection(val_timestamps)) == 0
    assert len(val_timestamps.intersection(test_timestamps)) == 0
    assert len(train_timestamps.intersection(test_timestamps)) == 0


def test_multi_station_chronological_splits():
    """
    Verify chronological ordering is preserved independently across multiple stations.
    """
    records = []
    for st in ["STA-01", "STA-02"]:
        for i in range(20):
            records.append({
                "station_code": st,
                "device_id": f"DEV-{st}",
                "timestamp": f"2026-09-01T{i:02d}:00:00Z",
                "ph": 7.0,
                "turbidity": 2.0,
                "tds": 200.0,
                "temperature": 20.0,
            })
    df = pd.DataFrame(records)
    train_df, val_df, test_df = create_chronological_splits(df)

    for st in ["STA-01", "STA-02"]:
        st_train = train_df[train_df["station_code"] == st]
        st_val = val_df[val_df["station_code"] == st]
        st_test = test_df[test_df["station_code"] == st]

        assert st_train["timestamp"].max() <= st_val["timestamp"].min()
        assert st_val["timestamp"].max() <= st_test["timestamp"].min()
