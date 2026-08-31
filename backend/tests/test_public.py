def test_public_station_viewing_no_auth_required(client, seeded_water_data):
    response = client.get("/api/public/stations/TEST-STA-01")
    assert response.status_code == 200
    data = response.json()
    assert data["station_code"] == "TEST-STA-01"
    assert data["station_name"] == "Station Beta"
    assert data["zone"] == "Central Zone"
    assert data["location"] == "Zone B Point 1"
    assert data["latitude"] == 12.9716
    assert data["longitude"] == 77.5946
    assert data["public_warning"] == "NORMAL"
    assert data["public_message"] == "Water is clear and potable."
    assert data["water_source"]["source_code"] == "TEST-SOURCE"
    assert data["water_source"]["name"] == "Test River Basin"


def test_public_station_not_found_returns_404(client):
    response = client.get("/api/public/stations/NONEXISTENT-CODE")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"]
