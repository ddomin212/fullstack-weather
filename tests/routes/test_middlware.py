import time

import pytest


def test_trusted_host_middleware(test_app, additional_params):
    response = test_app.post(
        "/weather/city?city=London",
        json={"token": "empty"},
        headers={"Host": "pepa", "Content-Type": "application/json"},
    )
    assert response.content == b"Invalid host header"


def test_fastapi_query_check_missing(test_app, additional_params):
    response = test_app.post(
        "/weather/city",
        json={"token": "empty"},
        **additional_params,
    )
    assert response.status_code == 422
    assert response.json() == {
        "detail": [
            {
                "loc": ["query", "city"],
                "msg": "field required",
                "type": "value_error.missing",
            }
        ]
    }


def test_fastapi_body_check_missing(test_app, additional_params):
    response = test_app.post(
        "/weather/city?city=London",
        json={},
        **additional_params,
    )
    assert response.status_code == 422
    print(response.json())
    assert response.json() == {
        "detail": [
            {
                "loc": ["body", "token"],
                "msg": "field required",
                "type": "value_error.missing",
            }
        ]
    }


def test_fastapi_not_found(test_app, additional_params):
    response = test_app.post(
        "/weather/country",
        json={"token": "empty"},
        **additional_params,
    )
    assert response.status_code == 404


@pytest.mark.skip(reason="takes too long")
def test_rate_limiter(test_app, additional_params):
    counter = 0
    while True:
        counter += 1
        response = test_app.post(
            "/weather/city?city=London",
            json={"token": "empty"},
            **additional_params,
        )
        if response.status_code == 429:
            break
    time.sleep(60)
    assert counter == 31
