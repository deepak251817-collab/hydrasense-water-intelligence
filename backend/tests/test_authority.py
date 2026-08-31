def test_authority_me_success(client, authority_token_headers, authority_user):
    response = client.get("/api/authority/me", headers=authority_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == authority_user.id
    assert data["email"] == authority_user.email
    assert data["role"] == "AUTHORITY"


def test_authority_stations_returns_all_stations(client, authority_token_headers, seeded_water_data):
    response = client.get("/api/authority/stations", headers=authority_token_headers)
    assert response.status_code == 200
    stations = response.json()
    assert len(stations) >= 1
    assert any(s["station_code"] == "TEST-STA-01" for s in stations)
    station = next(s for s in stations if s["station_code"] == "TEST-STA-01")
    assert station["station_name"] == "Station Beta"
    assert station["water_source"]["source_code"] == "TEST-SOURCE"


def test_authority_endpoints_unauthorized_without_token(client):
    res_me = client.get("/api/authority/me")
    assert res_me.status_code == 401

    res_sta = client.get("/api/authority/stations")
    assert res_sta.status_code == 401
