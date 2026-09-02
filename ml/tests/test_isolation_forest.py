"""
Pytest Test Suite for HydraSense Isolation Forest Anomaly Detection (Phase 5B).

Tests:
1. Model training & .joblib file creation
2. Model loading & persistence consistency
3. Feature selection (ph, turbidity, tds, temperature)
4. Anomaly prediction & binary label mapping (0=normal, 1=anomaly)
5. Result columns & schema validation
6. Multi-station preservation & chronological sorting
7. Reproducibility with fixed random_state
8. Missing-value handling
9. Data leakage protection (verifying validation/test sets are never used to fit model)
10. Wording safety (no 'contaminated' or 'polluted' terms)
11. Simulator stress-test cases (normal, gradual degradation, sudden spikes, physical faults)
"""

import os
from pathlib import Path
import pytest
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest

from ml.scripts.train_isolation_forest import train_isolation_forest, APPROVED_FEATURES
from ml.scripts.detect_anomalies import detect_anomalies
from ml.scripts.evaluate_isolation_forest import evaluate_isolation_forest


@pytest.fixture
def synthetic_train_df():
    """Generate 60 synthetic normal training telemetry records."""
    np.random.seed(42)
    records = []
    for i in range(60):
        records.append({
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": f"2026-09-01T{i//4:02d}:{(i%4)*15:02d}:00Z",
            "ph": float(np.random.normal(7.2, 0.15)),
            "turbidity": float(np.random.normal(3.0, 0.3)),
            "tds": float(np.random.normal(250.0, 10.0)),
            "temperature": float(np.random.normal(24.0, 0.5)),
        })
    return pd.DataFrame(records)


@pytest.fixture
def synthetic_splits(tmp_path, synthetic_train_df):
    """Save synthetic train, validation, and test datasets to temporary directory."""
    train_path = tmp_path / "train.csv"
    val_path = tmp_path / "validation.csv"
    test_path = tmp_path / "test.csv"
    model_path = tmp_path / "isolation_forest.joblib"

    synthetic_train_df.to_csv(train_path, index=False)

    # Validation set with slightly altered range
    val_records = []
    for i in range(15):
        val_records.append({
            "station_code": "STA-01",
            "device_id": "DEV-01",
            "timestamp": f"2026-09-02T{i:02d}:00:00Z",
            "ph": 7.2,
            "turbidity": 3.0,
            "tds": 250.0,
            "temperature": 24.0,
        })
    pd.DataFrame(val_records).to_csv(val_path, index=False)

    # Test set with normal + abnormal observations
    test_records = [
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-03T01:00:00Z", "ph": 7.2, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-03T02:00:00Z", "ph": 3.1, "turbidity": 180.0, "tds": 1500.0, "temperature": 45.0},
    ]
    pd.DataFrame(test_records).to_csv(test_path, index=False)

    return {
        "train_path": train_path,
        "val_path": val_path,
        "test_path": test_path,
        "model_path": model_path,
    }


# 1. Model training & file creation test
def test_train_model_file_creation(synthetic_splits):
    model = train_isolation_forest(
        train_path=synthetic_splits["train_path"],
        model_path=synthetic_splits["model_path"],
        contamination=0.05,
        random_state=42
    )
    assert synthetic_splits["model_path"].exists()
    assert isinstance(model, IsolationForest)


# 2. Model persistence consistency test
def test_model_persistence_consistency(synthetic_splits):
    model_orig = train_isolation_forest(
        train_path=synthetic_splits["train_path"],
        model_path=synthetic_splits["model_path"],
        random_state=42
    )
    model_reloaded = joblib.load(synthetic_splits["model_path"])

    sample_X = pd.DataFrame([{
        "ph": 7.2, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0
    }])

    pred_orig = model_orig.predict(sample_X)
    pred_reloaded = model_reloaded.predict(sample_X)
    score_orig = model_orig.decision_function(sample_X)
    score_reloaded = model_reloaded.decision_function(sample_X)

    np.testing.assert_array_equal(pred_orig, pred_reloaded)
    np.testing.assert_array_almost_equal(score_orig, score_reloaded)


# 3. Approved feature selection test
def test_feature_selection():
    assert APPROVED_FEATURES == ["ph", "turbidity", "tds", "temperature"]


# 4. Anomaly prediction & binary mapping test
def test_detect_anomalies_mapping(synthetic_splits):
    train_isolation_forest(
        train_path=synthetic_splits["train_path"],
        model_path=synthetic_splits["model_path"],
        contamination=0.1,
        random_state=42
    )
    output_path = synthetic_splits["model_path"].parent / "results.csv"
    res_df = detect_anomalies(
        input_path=synthetic_splits["test_path"],
        model_path=synthetic_splits["model_path"],
        output_path=output_path
    )

    assert "anomaly_score" in res_df.columns
    assert "anomaly_label" in res_df.columns
    # Labels must strictly be 0 (normal) or 1 (anomaly)
    unique_labels = set(res_df["anomaly_label"].unique())
    assert unique_labels.issubset({0, 1})

    # Row 0 (normal readings) -> label 0
    assert res_df.iloc[0]["anomaly_label"] == 0
    # Row 1 (extreme abnormal readings) -> label 1
    assert res_df.iloc[1]["anomaly_label"] == 1


# 5. Schema & metadata column test
def test_anomaly_result_columns(synthetic_splits):
    train_isolation_forest(
        train_path=synthetic_splits["train_path"],
        model_path=synthetic_splits["model_path"],
        random_state=42
    )
    output_path = synthetic_splits["model_path"].parent / "results.csv"
    res_df = detect_anomalies(
        input_path=synthetic_splits["test_path"],
        model_path=synthetic_splits["model_path"],
        output_path=output_path
    )

    expected_cols = [
        "station_code", "device_id", "timestamp",
        "ph", "turbidity", "tds", "temperature",
        "anomaly_score", "anomaly_label"
    ]
    for col in expected_cols:
        assert col in res_df.columns


# 6. Multi-station preservation & chronological sorting test
def test_multi_station_handling(tmp_path):
    train_df = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-02", "device_id": "DEV-02", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.1, "turbidity": 2.1, "tds": 210.0, "temperature": 21.0},
    ] * 20)
    train_path = tmp_path / "train.csv"
    model_path = tmp_path / "model.joblib"
    train_df.to_csv(train_path, index=False)

    train_isolation_forest(train_path=train_path, model_path=model_path, random_state=42)

    test_df = pd.DataFrame([
        {"station_code": "STA-02", "device_id": "DEV-02", "timestamp": "2026-09-01T12:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T14:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.0, "turbidity": 2.0, "tds": 200.0, "temperature": 20.0},
    ])
    test_path = tmp_path / "test.csv"
    output_path = tmp_path / "output.csv"
    test_df.to_csv(test_path, index=False)

    res_df = detect_anomalies(input_path=test_path, model_path=model_path, output_path=output_path)

    # Station codes retained and ordered chronologically per station
    assert list(res_df["station_code"]) == ["STA-01", "STA-01", "STA-02"]
    assert list(res_df["timestamp"]) == ["2026-09-01T10:00:00Z", "2026-09-01T14:00:00Z", "2026-09-01T12:00:00Z"]


# 7. Model reproducibility test
def test_model_reproducibility(synthetic_splits):
    m1 = train_isolation_forest(train_path=synthetic_splits["train_path"], model_path=synthetic_splits["model_path"], random_state=42)
    p1 = m1.predict(pd.DataFrame([{"ph": 7.2, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0}]))

    m2 = train_isolation_forest(train_path=synthetic_splits["train_path"], model_path=synthetic_splits["model_path"], random_state=42)
    p2 = m2.predict(pd.DataFrame([{"ph": 7.2, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0}]))

    assert p1[0] == p2[0]


# 8. Missing value handling test
def test_missing_value_handling(synthetic_splits):
    train_isolation_forest(train_path=synthetic_splits["train_path"], model_path=synthetic_splits["model_path"], random_state=42)

    df_missing = pd.DataFrame([
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": None, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0},
    ])
    test_path = synthetic_splits["train_path"].parent / "missing.csv"
    out_path = synthetic_splits["train_path"].parent / "missing_res.csv"
    df_missing.to_csv(test_path, index=False)

    res_df = detect_anomalies(input_path=test_path, model_path=synthetic_splits["model_path"], output_path=out_path)
    assert len(res_df) == 1
    assert "anomaly_label" in res_df.columns


# 9. No training on validation or test data test
def test_no_training_on_val_or_test(synthetic_splits, monkeypatch):
    """Verify that train_isolation_forest only reads the specified train_path."""
    read_paths = []
    orig_read_csv = pd.read_csv

    def mock_read_csv(filepath, *args, **kwargs):
        read_paths.append(str(filepath))
        return orig_read_csv(filepath, *args, **kwargs)

    monkeypatch.setattr(pd, "read_csv", mock_read_csv)

    train_isolation_forest(
        train_path=synthetic_splits["train_path"],
        model_path=synthetic_splits["model_path"],
        random_state=42
    )

    # Assert only train_path was read
    assert len(read_paths) == 1
    assert read_paths[0] == str(synthetic_splits["train_path"].resolve())
    assert str(synthetic_splits["val_path"].resolve()) not in read_paths
    assert str(synthetic_splits["test_path"].resolve()) not in read_paths


# 10. Wording safety test
def test_no_contamination_words_in_output(synthetic_splits):
    train_isolation_forest(synthetic_splits["train_path"], synthetic_splits["model_path"], random_state=42)
    output_path = synthetic_splits["model_path"].parent / "results.csv"
    detect_anomalies(synthetic_splits["test_path"], synthetic_splits["model_path"], output_path)

    content = output_path.read_text(encoding="utf-8").lower()
    assert "contaminated" not in content
    assert "polluted" not in content


# 11. Simulator stress-test cases
def test_simulator_stress_scenarios(synthetic_splits):
    """
    Stress test model responsiveness against simulated physical anomalies:
    - Normal baseline
    - Gradual deterioration
    - Sudden spike
    - Implausible physical fault
    """
    train_isolation_forest(synthetic_splits["train_path"], synthetic_splits["model_path"], contamination=0.1, random_state=42)

    scenarios = pd.DataFrame([
        # Case A: Normal/stable baseline
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T10:00:00Z", "ph": 7.2, "turbidity": 3.0, "tds": 250.0, "temperature": 24.0},
        # Case B: Gradual deterioration (elevated turbidity/TDS)
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T11:00:00Z", "ph": 6.1, "turbidity": 45.0, "tds": 650.0, "temperature": 28.0},
        # Case C: Sudden spike (pH drop + massive turbidity spike)
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T12:00:00Z", "ph": 4.2, "turbidity": 150.0, "tds": 1200.0, "temperature": 32.0},
        # Case D: Extreme hardware fault (pH=0.1, temp=55.0)
        {"station_code": "STA-01", "device_id": "DEV-01", "timestamp": "2026-09-01T13:00:00Z", "ph": 0.1, "turbidity": 300.0, "tds": 2500.0, "temperature": 55.0},
    ])

    test_file = synthetic_splits["train_path"].parent / "stress.csv"
    out_file = synthetic_splits["train_path"].parent / "stress_out.csv"
    scenarios.to_csv(test_file, index=False)

    res_df = detect_anomalies(test_file, synthetic_splits["model_path"], out_file)

    # Normal baseline should have lower anomaly score / normal label
    # Sudden spike and extreme hardware fault should have lower score and be classified as anomalies (1)
    assert res_df.iloc[0]["anomaly_label"] == 0
    assert res_df.iloc[2]["anomaly_label"] == 1
    assert res_df.iloc[3]["anomaly_label"] == 1
    assert res_df.iloc[3]["anomaly_score"] < res_df.iloc[0]["anomaly_score"]


# 12. Qualitative evaluation test
def test_evaluate_script(synthetic_splits):
    train_isolation_forest(synthetic_splits["train_path"], synthetic_splits["model_path"], random_state=42)
    res = evaluate_isolation_forest(
        model_path=synthetic_splits["model_path"],
        val_path=synthetic_splits["val_path"],
        test_path=synthetic_splits["test_path"]
    )
    assert "disclaimer" in res
    assert "validation" in res
    assert "test" in res
    assert "Ground-truth anomaly labels are not available" in res["disclaimer"]
