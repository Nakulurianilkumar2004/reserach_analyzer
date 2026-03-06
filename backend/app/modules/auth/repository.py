# app/modules/auth/repository.py
from bson import ObjectId
from app.core.database import get_database

def user_helper(user: dict, include_password: bool = False) -> dict:
    """
    Convert MongoDB document to JSON-serializable dict.
    Optionally include hashed password for login verification.
    """
    if not user:
        return None

    result = {
        "_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "is_active": user.get("is_active", True),
    }

    if include_password:
        result["password"] = user["password"]

    return result


def get_user_by_email(email: str, include_password: bool = False):
    db = get_database()
    user = db.users.find_one({"email": email})
    return user_helper(user, include_password=include_password)


def get_user_by_id(user_id: str, include_password: bool = False):
    db = get_database()
    user = db.users.find_one({"_id": ObjectId(user_id)})
    return user_helper(user, include_password=include_password)


def create_user(user_data: dict):
    db = get_database()
    result = db.users.insert_one(user_data)
    user_data["_id"] = str(result.inserted_id)
    return user_data