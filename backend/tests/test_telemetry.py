import json
from datetime import datetime, timezone
import pytest
from app.models.water import WaterSource, MonitoringStation, SensorReading
from app.services.mqtt_service import process_telemetry_payload, validate_telemetry_payload


@pytest.fixture
def seeded_stations(db_session):
    source = WaterSource(
        source_code="ARKAVATHI-TEST",
        name="Arkavathi Test Basin",
        source_type="RIVER",
        description="Testing source",
    )
    db_session.add(source)
    db_session.flush()

    stations = []
    for code in ["ARK-001", "ARK-002", "ARK-003"]:
        s = MonitoringStation(
            station_code=code,
            water_source_id=source.id,
            station_name=f"Station {code}",
            zone="Catchment Zone",
            location=f"Location {code}",
            latitude=13.0,
            longitude=77.0,
            public_warning="NORMAL",
            public_message="Water clear",
            is_active=True,
        )
        db_session.add(s)
        stations.append(s)

    db_session.commit()
    return stations


# 1. Valid telemetry
def test_valid_telemetry_ingestion(db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.2,
        "turbidity": 4.5,
        "tds": 210.0,
        "temperature": 25.5
    })

    result = process_telemetry_payload(payload, db_session_factory=lambda: db_session)
    assert result is True

    reading = db_session.query(SensorReading).filter(SensorReading.device_id == "STATION-ARK-001").first()
    assert reading is not None
    assert reading.ph == 7.2
    assert reading.turbidity == 4.5
    assert reading.tds == 210.0
    assert reading.temperature == 25.5


# 2. Invalid JSON
def test_invalid_json_payload(db_session, seeded_stations):
    invalid_json = "{ station_code: ARK-001, pH: 7.0 "  # Broken syntax
    result = process_telemetry_payload(invalid_json, db_session_factory=lambda: db_session)
    assert result is False
    assert db_session.query(SensorReading).count() == 0


# 3. Unknown station
def test_unknown_station_rejection(db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "UNKNOWN-999",
        "device_id": "STATION-UNK-999",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": 5.0,
        "tds": 200.0,
        "temperature": 25.0
    })
    result = process_telemetry_payload(payload, db_session_factory=lambda: db_session)
    assert result is False
    assert db_session.query(SensorReading).count() == 0


# 4. Invalid pH
def test_invalid_ph_rejection(db_session, seeded_stations):
    payload_high = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 15.5,  # > 14
        "turbidity": 5.0,
        "tds": 200.0,
        "temperature": 25.0
    })
    result_high = process_telemetry_payload(payload_high, db_session_factory=lambda: db_session)
    assert result_high is False

    payload_neg = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": -1.0,  # < 0
        "turbidity": 5.0,
        "tds": 200.0,
        "temperature": 25.0
    })
    result_neg = process_telemetry_payload(payload_neg, db_session_factory=lambda: db_session)
    assert result_neg is False


# 5. Negative TDS
def test_negative_tds_rejection(db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": 5.0,
        "tds": -50.0,  # Negative
        "temperature": 25.0
    })
    result = process_telemetry_payload(payload, db_session_factory=lambda: db_session)
    assert result is False


# 6. Negative turbidity
def test_negative_turbidity_rejection(db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": -10.0,  # Negative
        "tds": 200.0,
        "temperature": 25.0
    })
    result = process_telemetry_payload(payload, db_session_factory=lambda: db_session)
    assert result is False


# 7. Invalid temperature
def test_invalid_temperature_rejection(db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": 5.0,
        "tds": 200.0,
        "temperature": 150.0  # Extreme out of range
    })
    result = process_telemetry_payload(payload, db_session_factory=lambda: db_session)
    assert result is False


# 8. Latest reading authority endpoint
def test_latest_reading_endpoint(client, authority_token_headers, db_session, seeded_stations):
    payload1 = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": 4.0,
        "tds": 200.0,
        "temperature": 25.0
    })
    payload2 = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:05:00Z",  # Newest
        "pH": 6.8,
        "turbidity": 12.0,
        "tds": 350.0,
        "temperature": 27.5
    })

    process_telemetry_payload(payload1, db_session_factory=lambda: db_session)
    process_telemetry_payload(payload2, db_session_factory=lambda: db_session)

    res = client.get("/api/authority/stations/ARK-001/readings/latest", headers=authority_token_headers)
    assert res.status_code == 200
    data = res.json()

    assert data["station_code"] == "ARK-001"
    assert data["pH"] == 6.8
    assert data["turbidity"] == 12.0
    assert data["tds"] == 350.0
    assert data["temperature"] == 27.5


# 9. Multiple readings for one station
def test_multiple_readings_for_one_station(client, authority_token_headers, db_session, seeded_stations):
    for i in range(3):
        payload = json.dumps({
            "station_code": "ARK-002",
            "device_id": "STATION-ARK-002",
            "timestamp": f"2026-08-31T23:0{i}:00Z",
            "pH": 7.0 + i * 0.1,
            "turbidity": 5.0 + i,
            "tds": 200.0 + i * 10,
            "temperature": 25.0 + i
        })
        process_telemetry_payload(payload, db_session_factory=lambda: db_session)

    res = client.get("/api/authority/stations/ARK-002/readings", headers=authority_token_headers)
    assert res.status_code == 200
    history = res.json()
    assert len(history) == 3
    # Check ordering descending by timestamp
    assert history[0]["pH"] == 7.2
    assert history[2]["pH"] == 7.0


# 10. Multiple stations receiving telemetry
def test_multiple_stations_receiving_telemetry(db_session, seeded_stations):
    for code in ["ARK-001", "ARK-002", "ARK-003"]:
        payload = json.dumps({
            "station_code": code,
            "device_id": f"STATION-{code}",
            "timestamp": "2026-08-31T23:00:00Z",
            "pH": 7.1,
            "turbidity": 4.0,
            "tds": 190.0,
            "temperature": 24.5
        })
        assert process_telemetry_payload(payload, db_session_factory=lambda: db_session) is True

    for code in ["ARK-001", "ARK-002", "ARK-003"]:
        station = db_session.query(MonitoringStation).filter(MonitoringStation.station_code == code).first()
        reading = db_session.query(SensorReading).filter(SensorReading.station_id == station.id).first()
        assert reading is not None
        assert reading.device_id == f"STATION-{code}"


# 11. Authority role requirement
def test_authority_role_requirement(client, product_token_headers, db_session, seeded_stations):
    payload = json.dumps({
        "station_code": "ARK-001",
        "device_id": "STATION-ARK-001",
        "timestamp": "2026-08-31T23:00:00Z",
        "pH": 7.0,
        "turbidity": 4.0,
        "tds": 200.0,
        "temperature": 25.0
    })
    process_telemetry_payload(payload, db_session_factory=lambda: db_session)

    # 403 when called by PRODUCT_USER role
    res_product = client.get("/api/authority/stations/ARK-001/readings/latest", headers=product_token_headers)
    assert res_product.status_code == 403

    # 401 when called unauthenticated
    res_no_auth = client.get("/api/authority/stations/ARK-001/readings/latest")
    assert res_no_auth.status_code == 401


# 12. Public endpoint unchanged
def test_public_endpoint_unchanged(client, db_session, seeded_stations):
    res = client.get("/api/public/stations/ARK-001")
    assert res.status_code == 200
    data = res.json()
    assert data["station_code"] == "ARK-001"
    assert "public_warning" in data
    assert "public_message" in data
