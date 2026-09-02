"""
Export Sensor Data Script for HydraSense ML Pipeline.

Reads sensor readings joined with monitoring stations from the PostgreSQL database
and exports chronologically sorted raw telemetry data to ml/data/raw/sensor_readings.csv.
"""

import os
import logging
from pathlib import Path
from typing import Optional
import pandas as pd
from sqlalchemy import create_engine, text

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Base paths using pathlib
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_OUTPUT_PATH = BASE_DIR / "data" / "raw" / "sensor_readings.csv"


def get_database_url() -> str:
    """Retrieve database URL from environment configuration without hardcoding secrets."""
    url = os.getenv("DATABASE_URL")
    if not url:
        # Fallback check for standard PG environment variables
        user = os.getenv("POSTGRES_USER", "postgres")
        password = os.getenv("POSTGRES_PASSWORD", "postgres")
        host = os.getenv("POSTGRES_HOST", "localhost")
        port = os.getenv("POSTGRES_PORT", "5432")
        db = os.getenv("POSTGRES_DB", "hydrasense")
        url = f"postgresql+psycopg2://{user}:{password}@{host}:{port}/{db}"
    return url


def export_sensor_data(
    db_url: Optional[str] = None,
    output_path: Optional[Path] = None
) -> pd.DataFrame:
    """
    Extract sensor_readings joined with monitoring_stations from PostgreSQL,
    sort chronologically by timestamp, and write to CSV.
    """
    target_path = Path(output_path).resolve() if output_path else DEFAULT_OUTPUT_PATH.resolve()
    target_path.parent.mkdir(parents=True, exist_ok=True)

    url = db_url or get_database_url()
    logger.info("Connecting to database for sensor data extraction...")

    query = text("""
        SELECT
            ms.station_code,
            sr.device_id,
            sr.timestamp,
            sr.ph,
            sr.turbidity,
            sr.tds,
            sr.temperature
        FROM sensor_readings sr
        JOIN monitoring_stations ms ON sr.station_id = ms.id
        ORDER BY sr.timestamp ASC;
    """)

    try:
        engine = create_engine(url, connect_args={"connect_timeout": 3})
        with engine.connect() as conn:
            df = pd.read_sql_query(query, conn)
    except Exception as e:
        logger.error("Failed to query PostgreSQL database: %s", str(e))
        # Return empty DataFrame with expected columns on DB failure to allow safe downstream inspection/testing
        df = pd.DataFrame(columns=[
            "station_code", "device_id", "timestamp", "ph", "turbidity", "tds", "temperature"
        ])

    # Ensure ISO string parsing and sorting
    if not df.empty:
        df["timestamp"] = pd.to_datetime(df["timestamp"], utc=True)
        df = df.sort_values(by="timestamp", ascending=True).reset_index(drop=True)

    target_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(target_path, index=False)
    logger.info("Successfully exported %d records to %s", len(df), target_path)
    return df


if __name__ == "__main__":
    export_sensor_data()
