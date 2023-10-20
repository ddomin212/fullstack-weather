import os

import pytest
from app import app
from config.cfg_app import initialize_app
from config.firebase import auth, db
from fastapi.testclient import TestClient


@pytest.fixture(scope="session")
def test_app():
    # Create a new instance of the app with the middleware
    initialize_app(app)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(scope="session")
def csrf_token(test_app):
    response = test_app.get(
        "/csrftoken",
        headers={
            "Host": os.getenv("SECRET_HOST_HEADER"),
            "Content-Type": "application/json",
        },
    )
    assert response.status_code == 200
    print(response.cookies)
    return response.cookies["fastapi-csrf-token"], response.json()["csrf"]


@pytest.fixture(scope="session")
def additional_params(csrf_token):
    return {
        "headers": {
            "Host": os.getenv("SECRET_HOST_HEADER"),
            "Content-Type": "application/json",
            # "X-CSRF-TOKEN": csrf_token[1],
        },
        "cookies": {
            # {"fastapi-csrf-token": csrf_token[0]}
        },
    }


@pytest.fixture(scope="session")
def auth_client(test_app, additional_params):
    user = auth.sign_in_with_email_and_password("tester@gmail.com", "123456")
    response = test_app.post(
        "/login",
        json={"token": user["idToken"]},
        **additional_params,
    )
    data = response.json()
    print(data)
    assert response.status_code == 200
    assert data["tier"] == "free"
    assert data["user"] == "Test Name"
    return user


@pytest.fixture(scope="session")
def paid_client(test_app, additional_params):
    user = auth.sign_in_with_email_and_password("paid_tester@gmail.com", "123456")
    response = test_app.post(
        "/login",
        json={"token": user["idToken"]},
        **additional_params,
    )
    data = response.json()
    assert response.status_code == 200
    assert data["tier"] == "paid"
    assert data["user"] == "Paid Test User"
    return user
