# security.py
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from app.core.config import settings

# ---------------------------
# Password hashing
# ---------------------------
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    """
    Hash a plain password using bcrypt (max 72 chars).
    """
    password = password[:72]  # bcrypt limit
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    """
    Verify a plain password against hashed password.
    """
    plain_password = plain_password[:72]
    return pwd_context.verify(plain_password, hashed_password)

# ---------------------------
# JWT token creation
# ---------------------------
def create_access_token(data: dict):
    """
    Create a JWT token with expiration.
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

# ---------------------------
# JWT token decoding (for cookies)
# ---------------------------
def decode_token(token: str):
    """
    Decode JWT token from cookie.
    Returns payload dict or None if invalid.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        return None