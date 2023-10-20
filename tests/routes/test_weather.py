from app import app
from fastapi.testclient import TestClient

client = TestClient(app)


def _test_weather(test_app, additional_params, client, url, paid=False):
    response = test_app.post(
        url,
        json={"token": client["idToken"]},
        **additional_params,
    )
    assert response.status_code == 200

    if paid:
        assert "air_quality" in response.json()
        assert "historical" in response.json()

    assert "weather" in response.json()
    assert "forecast" in response.json()
    assert "units" in response.json()


def test_weather_by_city(test_app, additional_params, auth_client, paid_client):
    _test_weather(test_app, additional_params, auth_client, "/weather/city?city=London")
    _test_weather(
        test_app, additional_params, paid_client, "/weather/city?city=London", paid=True
    )


def test_weather_by_coordinates(test_app, additional_params, auth_client, paid_client):
    _test_weather(
        test_app,
        additional_params,
        auth_client,
        "/weather/coordinates?lat=51.5074&lon=0.1278",
    )
    _test_weather(
        test_app,
        additional_params,
        paid_client,
        "/weather/coordinates?lat=51.5074&lon=0.1278",
        paid=True,
    )


def test_weather_anonymous(test_app, additional_params):
    _test_weather(
        test_app, additional_params, {"idToken": "empty"}, "/weather/city?city=London"
    )


def test_weather_wrong_token(test_app, additional_params):
    response = test_app.post(
        "/weather/city?city=London",
        json={"token": "wrong_token"},
        **additional_params,
    )
    assert response.status_code == 400
    assert response.json() == {"message": "Error in firebase: INVALID_ID_TOKEN"}


def test_weather_openweather_exception(test_app, additional_params):
    response = test_app.post(
        "/weather/city?city=wadsdasdawda",
        json={"token": "empty"},
        **additional_params,
    )
    assert response.status_code == 404
    assert response.json() == {"message": "city not found"}
