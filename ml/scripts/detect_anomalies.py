"""
Anomaly Detection & Scoring Script for HydraSense ML Pipeline (Phase 5B).

Loads trained Isolation Forest model from ml/models/isolation_forest.joblib,
scores processed telemetry data, and outputs ml/data/processed/anomaly_results.csv.

Mapping:
- normal = 0 (sklearn predict == 1)
- anomaly = 1 (sklearn predict == -1)

Score:
- anomaly_score = model.decision_function(X)
  (lower/negative values indicate higher degree of unusualness)
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import Optional
import pandas as pd
import numpy as np
import joblib
from sklearn.ensemble import IsolationForest

# Ensure workspace root is in sys.path
BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

DEFAULT_MODEL_PATH = BASE_DIR / "models" / "isolation_forest.joblib"
DEFAULT_INPUT_PATH = BASE_DIR / "data" / "processed" / "clean_sensor_readings.csv"
DEFAULT_OUTPUT_PATH = BASE_DIR / "data" / "processed" / "anomaly_results.csv"

APPROVED_FEATURES = ["ph", "turbidity", "tds", "temperature"]
REQUIRED_METADATA = ["station_code", "device_id", "timestamp"]


def detect_anomalies(
    input_path: Optional[Path] = None,
    model_path: Optional[Path] = None,
    output_path: Optional[Path] = None
) -> pd.DataFrame:
    """
    Load dataset and Isolation Forest model, compute anomaly scores & labels,
    and save sorted result CSV to disk.
    """
    src_input = Path(input_path).resolve() if input_path else DEFAULT_INPUT_PATH.resolve()
    src_model = Path(model_path).resolve() if model_path else DEFAULT_MODEL_PATH.resolve()
    dest_output = Path(output_path).resolve() if output_path else DEFAULT_OUTPUT_PATH.resolve()

    dest_output.parent.mkdir(parents=True, exist_ok=True)

    if not src_model.exists():
        raise FileNotFoundError(f"Trained model not found at {src_model}. Train model first.")

    if not src_input.exists():
        logger.warning("Input file not found at %s. Creating empty anomaly_results.csv", src_input)
        empty_cols = REQUIRED_METADATA + APPROVED_FEATURES + ["anomaly_score", "anomaly_label"]
        df_empty = pd.DataFrame(columns=empty_cols)
        df_empty.to_csv(dest_output, index=False)
        return df_empty

    logger.info("Loading model from %s", src_model)
    model: IsolationForest = joblib.load(src_model)

    logger.info("Loading telemetry dataset from %s", src_input)
    df = pd.read_csv(src_input)

    if df.empty:
        logger.warning("Input dataframe is empty. Writing empty anomaly_results.csv")
        empty_cols = [c for c in (REQUIRED_METADATA + APPROVED_FEATURES) if c in df.columns] + ["anomaly_score", "anomaly_label"]
        df_empty = pd.DataFrame(columns=empty_cols)
        df_empty.to_csv(dest_output, index=False)
        return df_empty

    # Ensure required feature columns exist
    missing_features = [col for col in APPROVED_FEATURES if col not in df.columns]
    if missing_features:
        raise KeyError(f"Input dataset missing required feature columns: {missing_features}")

    # Prepare feature matrix X
    X = df[APPROVED_FEATURES].copy()
    for col in APPROVED_FEATURES:
        X[col] = pd.to_numeric(X[col], errors="coerce")

    # Fill NaNs temporarily for prediction if any exist (e.g. median fill to avoid crash on incomplete rows)
    X_clean = X.fillna(X.median().fillna(0.0))

    # Compute Isolation Forest outputs
    # raw predictions: 1 = normal, -1 = anomaly
    raw_preds = model.predict(X_clean)
    # decision function: negative for anomalies, positive for normal
    raw_scores = model.decision_function(X_clean)

    # Convert to schema: normal = 0, anomaly = 1
    anomaly_labels = np.where(raw_preds == -1, 1, 0)

    result_df = df.copy()
    result_df["anomaly_score"] = np.round(raw_scores, 6)
    result_df["anomaly_label"] = anomaly_labels

    # Ensure station-aware chronological sorting
    if "timestamp" in result_df.columns:
        result_df["dt_temp"] = pd.to_datetime(result_df["timestamp"], utc=True, errors="coerce")
        sort_cols = ["station_code", "dt_temp"] if "station_code" in result_df.columns else ["dt_temp"]
        result_df = result_df.sort_values(by=sort_cols).reset_index(drop=True)
        result_df = result_df.drop(columns=["dt_temp"])

    # Ensure specific column order
    ordered_cols = [
        c for c in REQUIRED_METADATA if c in result_df.columns
    ] + [
        c for c in APPROVED_FEATURES if c in result_df.columns
    ] + ["anomaly_score", "anomaly_label"]

    remaining_cols = [c for c in result_df.columns if c not in ordered_cols]
    final_cols = ordered_cols + remaining_cols
    result_df = result_df[final_cols]

    dest_output.write_text(result_df.to_csv(index=False), encoding="utf-8")
    anomaly_count = int((result_df["anomaly_label"] == 1).sum())
    total_count = len(result_df)
    pct = (anomaly_count / total_count * 100) if total_count > 0 else 0.0

    logger.info(
        "Saved anomaly results to %s: total=%d, normal=%d, anomalous=%d (%.2f%%)",
        dest_output, total_count, total_count - anomaly_count, anomaly_count, pct
    )
    return result_df


def main():
    parser = argparse.ArgumentParser(description="Detect anomalies in telemetry using Isolation Forest.")
    parser.add_argument("--input-path", type=str, default=str(DEFAULT_INPUT_PATH), help="Path to input CSV")
    parser.add_argument("--model-path", type=str, default=str(DEFAULT_MODEL_PATH), help="Path to model joblib")
    parser.add_argument("--output-path", type=str, default=str(DEFAULT_OUTPUT_PATH), help="Output results CSV")
    args = parser.parse_args()

    detect_anomalies(
        input_path=Path(args.input_path),
        model_path=Path(args.model_path),
        output_path=Path(args.output_path)
    )


if __name__ == "__main__":
    main()
