# app/modules/auth/service.py
from fastapi import HTTPException, Response, status, Request, Depends
from app.modules.auth.repository import get_user_by_email, create_user, get_user_by_id
from app.core.security import hash_password, verify_password, create_access_token, decode_token  # use decode_token

# ---------------------------
# Register user
# ---------------------------
def register_user(data):
    """
    Registers a new user with default role 'user'.
    """
    existing = get_user_by_email(data.email)
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already exists")

    user_data = {
        "email": data.email,
        "password": hash_password(data.password),  # hash the password
        "role": "user",  # default role
        "is_active": True
    }

    create_user(user_data)
    return {"message": "User registered successfully"}


# ---------------------------
# Login user
def login_user(data, response: Response):
    """
    Logs in a user, verifies password, and sets JWT in cookie.
    """
    # Fetch user including hashed password
    user = get_user_by_email(data.email, include_password=True)

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token({"sub": str(user["_id"]), "role": user["role"]})

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        samesite="lax"
    )

    # Remove password from response
    user.pop("password", None)

    return {"message": "Login successful", "role": user["role"], "user_id": str(user["_id"])}


# ---------------------------
# Logout user
# ---------------------------
def logout_user(response: Response):
    """
    Deletes the access_token cookie.
    """
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}


# ---------------------------
# Get current user from cookie
# ---------------------------
def get_current_user(request: Request):
    """
    Reads JWT from 'access_token' cookie and returns the user dict.
    """
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user_id = payload.get("sub")
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return user


# ---------------------------
# Role-based access dependency
# ---------------------------
def require_role(role: str):
    """
    Dependency to restrict endpoints based on user role.
    Admins can access all roles.
    """
    def dependency(user: dict = Depends(get_current_user)):
        if user["role"] != role and user["role"] != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden: insufficient permissions")
        return user
    return dependency