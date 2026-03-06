# app/core/database.py

from pymongo import MongoClient
from pymongo.server_api import ServerApi
from app.core.config import settings

client = MongoClient(
    settings.MONGO_URI,
    server_api=ServerApi("1"),
    connectTimeoutMS=30000
)

database = client[settings.DATABASE_NAME]

# Initialize collections
users_collection = database["users"]
papers_collection = database["papers"]
embeddings_collection = database["embeddings"]
questions_collection = database["questions"]


def get_database():
    return database


def connect_to_mongo():
    try:
        client.admin.command("ping")
        print("✅ MongoDB connected successfully")
    except Exception as e:
        print("❌ MongoDB connection failed:", e)


def close_mongo_connection():
    client.close()
    print("⚠ MongoDB connection closed")