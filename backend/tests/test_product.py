from app.models.device import ProductDevice


def test_product_me_success(client, product_token_headers, product_user):
    response = client.get("/api/product/me", headers=product_token_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == product_user.id
    assert data["email"] == product_user.email
    assert data["role"] == "PRODUCT_USER"


def test_product_devices_returns_owned_devices(client, db_session, product_token_headers, product_user):
    # Create an owned device
    owned_device = ProductDevice(
        product_code="HS-MY-001",
        device_id="ESP32-MY-01",
        device_type="PERSONAL_WATER_TESTER",
        status="ACTIVE",
        owner_id=product_user.id
    )
    # Create another device owned by another or none
    unowned_device = ProductDevice(
        product_code="HS-OTHER-002",
        device_id="ESP32-OTHER-02",
        device_type="PERSONAL_WATER_TESTER",
        status="PENDING_ACTIVATION",
        owner_id=None
    )
    db_session.add_all([owned_device, unowned_device])
    db_session.commit()

    response = client.get("/api/product/devices", headers=product_token_headers)
    assert response.status_code == 200
    devices = response.json()
    assert len(devices) == 1
    assert devices[0]["product_code"] == "HS-MY-001"
    assert devices[0]["device_id"] == "ESP32-MY-01"
    assert devices[0]["owner_id"] == product_user.id


def test_product_endpoints_unauthorized_without_token(client):
    res_me = client.get("/api/product/me")
    assert res_me.status_code == 401

    res_dev = client.get("/api/product/devices")
    assert res_dev.status_code == 401
