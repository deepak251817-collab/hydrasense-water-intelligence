import pytest
from app.models.device import ProductDevice
from app.models.user import User, UserRole
from app.core.security import get_password_hash


def test_register_product_user_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "full_name": "New Tester",
            "role": "PRODUCT_USER"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "newuser@example.com"
    assert data["full_name"] == "New Tester"
    assert data["role"] == "PRODUCT_USER"
    assert data["is_active"] is True
    assert "password_hash" not in data


def test_register_duplicate_email_conflict(client):
    payload = {
        "email": "duplicate@example.com",
        "password": "Password123!",
        "full_name": "First User",
        "role": "PRODUCT_USER"
    }
    res1 = client.post("/api/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/auth/register", json=payload)
    assert res2.status_code == 409
    assert "already registered" in res2.json()["detail"]


def test_register_with_valid_product_code_claims_device(client, db_session):
    device = ProductDevice(
        product_code="HS-CLAIM-01",
        device_id="DEV-ESP32-999",
        device_type="PERSONAL_WATER_TESTER",
        status="PENDING_ACTIVATION",
        owner_id=None
    )
    db_session.add(device)
    db_session.commit()

    response = client.post(
        "/api/auth/register",
        json={
            "email": "deviceowner@example.com",
            "password": "Password123!",
            "full_name": "Device Owner",
            "role": "PRODUCT_USER",
            "product_code": "HS-CLAIM-01"
        }
    )
    assert response.status_code == 201
    user_id = response.json()["id"]

    db_session.refresh(device)
    assert device.owner_id == user_id
    assert device.status == "ACTIVE"
    assert device.activated_at is not None


def test_register_with_nonexistent_product_code_returns_400(client):
    response = client.post(
        "/api/auth/register",
        json={
            "email": "invalid_device@example.com",
            "password": "Password123!",
            "full_name": "No Device User",
            "role": "PRODUCT_USER",
            "product_code": "DOES-NOT-EXIST"
        }
    )
    assert response.status_code == 400
    assert "Invalid product code" in response.json()["detail"]


def test_register_with_already_claimed_product_code_returns_409(client, db_session, product_user):
    device = ProductDevice(
        product_code="HS-ALREADY-CLAIMED",
        device_id="DEV-CLAIMED-001",
        device_type="PERSONAL_WATER_TESTER",
        status="ACTIVE",
        owner_id=product_user.id
    )
    db_session.add(device)
    db_session.commit()

    response = client.post(
        "/api/auth/register",
        json={
            "email": "another_user@example.com",
            "password": "Password123!",
            "full_name": "Another User",
            "role": "PRODUCT_USER",
            "product_code": "HS-ALREADY-CLAIMED"
        }
    )
    assert response.status_code == 409
    assert "already been registered" in response.json()["detail"]


def test_login_success(client, db_session):
    user = User(
        email="login_user@example.com",
        password_hash=get_password_hash("CorrectPassword123!"),
        full_name="Login Success",
        role=UserRole.PRODUCT_USER,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "login_user@example.com",
            "password": "CorrectPassword123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "PRODUCT_USER"
    assert data["user"]["email"] == "login_user@example.com"


def test_login_wrong_password_unauthorized(client, db_session):
    user = User(
        email="wrong_pwd@example.com",
        password_hash=get_password_hash("CorrectPassword123!"),
        full_name="Wrong Pwd",
        role=UserRole.PRODUCT_USER,
        is_active=True
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "wrong_pwd@example.com",
            "password": "WrongPassword!"
        }
    )
    assert response.status_code == 401
    assert "Incorrect email or password" in response.json()["detail"]


def test_login_inactive_user_forbidden(client, db_session):
    user = User(
        email="inactive@example.com",
        password_hash=get_password_hash("Password123!"),
        full_name="Inactive User",
        role=UserRole.PRODUCT_USER,
        is_active=False
    )
    db_session.add(user)
    db_session.commit()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "inactive@example.com",
            "password": "Password123!"
        }
    )
    assert response.status_code == 403
    assert "inactive" in response.json()["detail"].lower()
