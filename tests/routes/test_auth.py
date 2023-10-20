def test_login(test_app, auth_client, additional_params):
    # Test successful login
    response = test_app.post(
        "/login",
        json={"token": auth_client["idToken"]},
        **additional_params,
    )
    assert response.status_code == 200

    # Test failed login
    response = test_app.post(
        "/login",
        json={"token": "invalid_jwt_token_here"},
        **additional_params,
    )
    assert response.status_code == 400
    assert response.json()["message"] == "Error in firebase: INVALID_ID_TOKEN"


def test_refresh(test_app, auth_client, additional_params):
    additional_params["cookies"]["token"] = auth_client["idToken"]

    # Test successful refresh
    response = test_app.post(
        "/refresh",
        json={
            "token": auth_client["idToken"],
            "refreshToken": auth_client["refreshToken"],
        },
        **additional_params,
    )
    assert response.status_code == 200
    assert response.json() == {"detail": "Refresh successful", "tier": "free"}
    assert "token" in response.cookies

    # # Test failed refresh
    # response = test_app.post(
    #     "/refresh",
    #     json={
    #         "token": "invalid_jwt_token_here",
    #         "refreshToken": auth_client["refreshToken"],
    #     },
    #     **additional_params,
    # )
    # assert response.status_code == 400
    # assert response.json() == {"message": "Token is invalid"}
    # assert "token" not in response.cookies


def test_logout(test_app, auth_client, additional_params):
    # Test successful logout
    additional_params["cookies"]["token"] = auth_client["idToken"]

    response = test_app.get(
        "/logout",
        **additional_params,
    )
    assert response.status_code == 200
    assert response.json() == {"message": "Logout successful"}
    assert "token" not in response.cookies
