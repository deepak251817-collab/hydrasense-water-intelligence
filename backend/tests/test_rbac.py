def test_product_user_cannot_access_authority_me(client, product_token_headers):
    response = client.get("/api/authority/me", headers=product_token_headers)
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]


def test_product_user_cannot_access_authority_stations(client, product_token_headers):
    response = client.get("/api/authority/stations", headers=product_token_headers)
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]


def test_authority_cannot_access_product_me(client, authority_token_headers):
    response = client.get("/api/product/me", headers=authority_token_headers)
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]


def test_authority_cannot_access_product_devices(client, authority_token_headers):
    response = client.get("/api/product/devices", headers=authority_token_headers)
    assert response.status_code == 403
    assert "Access denied" in response.json()["detail"]
