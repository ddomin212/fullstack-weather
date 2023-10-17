import os

import stripe
from config.firebase import auth, db
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
from fastapi_csrf_protect import CsrfProtect
from models.security import AuthToken
from requests.exceptions import HTTPError
from stripe.error import StripeError
from utils.errors import handle_exception, handle_pyrebase

load_dotenv()

stripe.api_key = os.getenv("STRIPE_API_KEY")

router = APIRouter()


@handle_exception
@router.post("/payment")
async def create_checkout_session(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    # Validate CSRF token
    csrf_protect.validate_csrf(request)

    # Create payment session on stripe
    try:
        # get user details
        user = auth.get_account_info(authToken.token)

        # create payment session
        payment_session = stripe.checkout.Session.create(
            mode="payment",
            payment_method_types=["card"],
            line_items=[
                {
                    "price": "price_1O1XLGIkzhBkf9zarOv31qM0",
                    "quantity": 1,
                },
            ],
            success_url=f"""http://localhost:8000/payment-success?session_id={"{CHECKOUT_SESSION_ID}"}&guid={user["users"][0]['localId']}""",
            cancel_url=f"http://localhost:8000/cancel",
        )

        # update user details with verification token for payment
        db.child("users").child(user["users"][0]["localId"]).update(
            {"verificationToken": payment_session.id}
        )

        # return payment session details
        return {
            "id": payment_session.id,
            "url": payment_session.url,
            "status_code": 200,
        }
    # If there is an error from Firebase (Pyrebase) or Stripe, handle it.
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )
    except StripeError as e:
        raise HTTPException(
            detail=f"Error in stripe: {e.user_message}", status_code=e.http_status
        )


@handle_exception
@router.get("/payment-success")
async def payment_success(session_id: str, guid: str):
    # Verify payment session
    try:
        # Get the verification token from the database
        verification_token = (
            db.child("users").child(guid).get().val()["verificationToken"]
        )

        # If the verification token matches the session id, update the user's tier to paid
        if session_id == verification_token:
            db.child("users").child(guid).update({"tier": "paid"})
            return RedirectResponse(url=f"http://localhost:3000/")
        else:
            raise HTTPException(
                detail="Verification token does not match", status_code=401
            )
    # If there is an error from Firebase (Pyrebase), or the verification token is not found, handle it.
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )
    except KeyError:
        raise HTTPException(detail="Verification token not found", status_code=400)
