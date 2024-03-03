# pylint: disable=E0401

from config.firebase import auth, db
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect
from models.security import AuthToken
from requests.exceptions import HTTPError
from utils.errors import handle_exception, handle_pyrebase

router = APIRouter()


@router.get("/csrftoken")
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
    """get CSRF token

    Args:
        csrf_protect (CsrfProtect, optional): CSRF protection. Defaults to Depends().

    Returns:
        dict: CSRF token
    """
    csrf_token, signed_token = csrf_protect.generate_csrf_tokens()
    response = JSONResponse({"detail": "CSRF cookie set", "csrf": csrf_token})
    csrf_protect.set_csrf_cookie(signed_token, response)
    return response


@handle_exception
@router.post("/login")
async def login(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    """login user via firebase

    Args:
        authToken: firebase JWT token

    Raises:
        HTTPException: if login fails

    Returns:
        dict: user details, including if the are a free or paid user
    """
    # Validate CSRF token
    # csrf_protect.validate_csrf(request)

    # Get user account info
    try:
        user = auth.get_account_info(authToken.token)
        g_uid = user["users"][0]["localId"]
        response.set_cookie(key="token", value=authToken.token)

        # Get user details from database
        user_db = db.child("users").child(g_uid).get().val()
        tier = None

        # If user is not in database, add them as a free user
        if not user_db:
            db.child("users").child(g_uid).update({"tier": "free"})
            tier = "free"
        else:
            tier = user_db["tier"]

        # Return user details
        return {
            "detail": "Login successful",
            "status_code": 200,
            "user": user["users"][0]["displayName"],
            "tier": tier,
        }
    # If there is an error from Firebase (Pyrebase), handle it.
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )


@handle_exception
@router.post("/refresh")
async def refresh(
    authToken: AuthToken,
    request: Request,
    response: Response,
    csrf_protect: CsrfProtect = Depends(),
):
    """refresh firebase JWT token

    Args:
        authToken: old firebase JWT token, including the refresh token

    Returns:
        dict: success or not, including if the user is a free or paid user
    """
    # Validate CSRF token
    # csrf_protect.validate_csrf(request)

    # Refresh token
    try:
        # Get new token
        # if authToken.token == request.cookies["token"]:
        user = auth.refresh(authToken.refreshToken)
        response.set_cookie(key="token", value=user["idToken"])

        # Get user tier and return it
        tier = db.child("users").child(user["userId"]).get().val()["tier"]
        return {"detail": "Refresh successful", "tier": tier}
        # else:
        #     raise HTTPException(detail="Token is invalid", status_code=400)
    # If there is an error from Firebase (Pyrebase), handle it.
    except HTTPError as e:
        response = handle_pyrebase(e)
        raise HTTPException(
            detail=f"Error in firebase: {response[0]['error']}", status_code=response[1]
        )


@handle_exception
@router.get("/logout")
async def logout(response: Response):
    """logout user from firebase"""
    response.delete_cookie(key="token")
    return {"message": "Logout successful"}
