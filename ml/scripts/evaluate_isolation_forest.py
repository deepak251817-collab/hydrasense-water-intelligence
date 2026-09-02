"""
Unsupervised Evaluation Script for HydraSense Isolation Forest (Phase 5B).

Evaluates the trained Isolation Forest model on validation and test datasets.
Outputs qualitative distribution statistics and anomaly score summary.
"""

import sys
import argparse
import logging
from pathlib import Path
from typing import Dict, Any, Optional
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
DEFAULT_VAL_PATH = BASE_DIR / "data" / "processed" / "validation.csv"
DEFAULT_TEST_PATH = BASE_DIR / "data" / "processed" / "test.csv"

APPROVED_FEATURES = ["ph", "turbidity", "tds", "temperature"]
GROUND_TRUTH_DISCLAIMER = (
    "Ground-truth anomaly labels are not available; evaluation is therefore unsupervised/qualitative."
)


def evaluate_split(
    model: IsolationForest,
    split_name: str,
    file_path: Path
) -> Dict[str, Any]:
    """Evaluate model on a single dataset split (validation or test)."""
    if not file_path.exists():
        logger.warning("%s dataset file not found at %s", split_name, file_path)
        return {"split": split_name, "status": "File not found", "observations": 0}

    df = pd.read_csv(file_path)
    if df.empty:
        return {"split": split_name, "status": "Empty file", "observations": 0}

    missing_cols = [c for c in APPROVED_FEATURES if c not in df.columns]
    if missing_cols:
        raise KeyError(f"{split_name} split missing required features: {missing_cols}")

    X = df[APPROVED_FEATURES].copy()
    for col in APPROVED_FEATURES:
        X[col] = pd.to_numeric(X[col], errors="coerce")
    X = X.fillna(X.median().fillna(0.0))

    raw_preds = model.predict(X)
    scores = model.decision_function(X)
    labels = np.where(raw_preds == -1, 1, 0)

    total_obs = len(df)
    anomalies = int((labels == 1).sum())
    normals = total_obs - anomalies
    pct = (anomalies / total_obs * 100) if total_obs > 0 else 0.0

    stats = {
        "min": float(np.min(scores)) if total_obs > 0 else None,
        "max": float(np.max(scores)) if total_obs > 0 else None,
        "mean": float(np.mean(scores)) if total_obs > 0 else None,
        "std": float(np.std(scores)) if total_obs > 1 else 0.0,
    }

    return {
        "split": split_name,
        "observations": total_obs,
        "normal_count": normals,
        "anomaly_count": anomalies,
        "anomaly_percentage": round(pct, 2),
        "score_statistics": stats,
    }


def evaluate_isolation_forest(
    model_path: Optional[Path] = None,
    val_path: Optional[Path] = None,
    test_path: Optional[Path] = None
) -> Dict[str, Any]:
    """
    Run unsupervised qualitative evaluation on validation and test datasets.
    """
    src_model = Path(model_path).resolve() if model_path else DEFAULT_MODEL_PATH.resolve()
    src_val = Path(val_path).resolve() if val_path else DEFAULT_VAL_PATH.resolve()
    src_test = Path(test_path).resolve() if test_path else DEFAULT_TEST_PATH.resolve()

    if not src_model.exists():
        raise FileNotFoundError(f"Model file not found at {src_model}")

    model: IsolationForest = joblib.load(src_model)

    val_metrics = evaluate_split(model, "Validation", src_val)
    test_metrics = evaluate_split(model, "Test", src_test)

    results = {
        "disclaimer": GROUND_TRUTH_DISCLAIMER,
        "validation": val_metrics,
        "test": test_metrics,
    }

    # Print clean readable terminal report
    print("\n" + "=" * 65)
    print("      HYDRASENSE ISOLATION FOREST UNSUPERVISED EVALUATION     ")
    print("=" * 65)
    print(f"DISCLAIMER:\n  {GROUND_TRUTH_DISCLAIMER}")
    print("-" * 65)

    for split_key, m in [("VALIDATION SPLIT", val_metrics), ("TEST SPLIT", test_metrics)]:
        print(f"\n[{split_key}]")
        print(f"  Total Observations:   {m.get('observations', 0)}")
        if m.get('observations', 0) > 0:
            print(f"  Normal Count:         {m.get('normal_count', 0)}")
            print(f"  Anomaly Count:        {m.get('anomaly_count', 0)} ({m.get('anomaly_percentage', 0):.2f}%)")
            st = m.get("score_statistics", {})
            mn = f"{st['min']:.4f}" if st.get('min') is not None else "N/A"
            mx = f"{st['max']:.4f}" if st.get('max') is not None else "N/A"
            avg = f"{st['mean']:.4f}" if st.get('mean') is not None else "N/A"
            sd = f"{st['std']:.4f}" if st.get('std') is not None else "N/A"
            print(f"  Anomaly Scores:       Min={mn}, Max={mx}, Mean={avg}, Std={sd}")
        else:
            print(f"  Status:               {m.get('status', 'No data')}")

    print("=" * 65 + "\n")
    return results


def main():
    parser = argparse.ArgumentParser(description="Evaluate Isolation Forest model on validation and test splits.")
    parser.add_argument("--model-path", type=str, default=str(DEFAULT_MODEL_PATH), help="Path to trained model joblib")
    parser.add_argument("--val-path", type=str, default=str(DEFAULT_VAL_PATH), help="Path to validation.csv")
    parser.add_argument("--test-path", type=str, default=str(DEFAULT_TEST_PATH), help="Path to test.csv")
    args = parser.parse_args()

    evaluate_isolation_forest(
        model_path=Path(args.model_path),
        val_path=Path(args.val_path),
        test_path=Path(args.test_path)
    )


if __name__ == "__main__":
    main()
