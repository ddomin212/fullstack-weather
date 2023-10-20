from config.firebase import db
from fastapi.responses import RedirectResponse


def test_create_payment_session(test_app, additional_params, auth_client):
    # Test successful payment session creation
    response = test_app.post(
        "/payment",
        json={"token": auth_client["idToken"]},
        **additional_params,
    )
    assert response.status_code == 200
    assert "id" in response.json()
    assert "url" in response.json()

    # Test failed payment session creation
    response = test_app.post(
        "/payment",
        json={"token": "invalid_jwt_token_here"},
        **additional_params,
    )
    assert response.status_code == 400
    assert response.json() == {"message": "Error in firebase: INVALID_ID_TOKEN"}


def test_payment_success(test_app, additional_params, auth_client):
    db.child("users").child(auth_client["localId"]).update(
        {"verificationToken": "mocked_verification_token", "tier": "free"}
    )

    # Test successful payment
    response = test_app.get(
        "/payment-success",
        params={
            "session_id": "mocked_verification_token",
            "guid": auth_client["localId"],
        },
        **additional_params,
    )
    assert response.url == "http://localhost:3000/"

    db.child("users").child(auth_client["localId"]).update(
        {"verificationToken": "mocked_verification_token", "tier": "free"}
    )

    # Test failed verification
    response = test_app.get(
        "/payment-success",
        params={
            "session_id": "invalid_stripe_session_id_here",
            "guid": auth_client["localId"],
        },
        **additional_params,
    )
    assert response.status_code == 401
    assert response.json() == {"message": "Verification token does not match"}

    # Test user not found
    response = test_app.get(
        "/payment-success",
        params={
            "session_id": "invalid_stripe_session_id_here",
            "guid": "somebody_else",
        },
        **additional_params,
    )
    assert response.status_code == 400
    assert response.json() == {"message": "Verification token not found"}
