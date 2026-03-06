from fastapi import APIRouter, Response, Depends, HTTPException
from app.modules.auth.schemas import RegisterSchema, LoginSchema
from app.modules.auth.service import (
    register_user,
    login_user,
    logout_user,
    get_current_user  # service function
)

router = APIRouter(tags=["Auth"])

# -----------------------
# Register
# -----------------------
@router.post("/register")
def register(data: RegisterSchema):
    """
    Registers a new user.
    Role is always 'user' by default.
    """
    return register_user(data)


# -----------------------
# Login
# -----------------------
@router.post("/login")
def login(data: LoginSchema, response: Response):
    """
    Logs in a user and sets a HTTP-only cookie with JWT.
    """
    return login_user(data, response)


# -----------------------
# Logout
# -----------------------
@router.post("/logout")
def logout(response: Response):
    """
    Logs out the user by deleting the cookie.
    """
    return logout_user(response)


# -----------------------
# Get current user
# -----------------------
@router.get("/user")
def get_user(current_user: dict = Depends(get_current_user)):
    return current_user