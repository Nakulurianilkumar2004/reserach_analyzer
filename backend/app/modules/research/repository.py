from bson import ObjectId
from app.core.database import get_database

# ---------------------------
# Papers
# ---------------------------

def save_paper(data):
    """
    Save a new paper document to the database
    """
    db = get_database()
    result = db.papers.insert_one(data)
    return str(result.inserted_id)


def save_embedding(data):
    """
    Save a text chunk embedding
    """
    db = get_database()
    db.embeddings.insert_one(data)


def get_embeddings(paper_id):
    """
    Get all embeddings for a specific paper
    """
    db = get_database()
    return list(db.embeddings.find({"paper_id": paper_id}))


def get_paper(paper_id):
    """
    Get a single paper by ID
    """
    db = get_database()
    return db.papers.find_one({"_id": ObjectId(paper_id)})


def get_all_papers():
    """
    Admin function: fetch all papers
    """
    db = get_database()
    return list(db.papers.find({}))


# ---------------------------
# Users
# ---------------------------

def save_user(user_data):
    """
    Save a new user
    """
    db = get_database()
    result = db.users.insert_one(user_data)
    return str(result.inserted_id)


def get_user_by_id(user_id):
    """
    Get a user by ObjectId or string ID
    """
    db = get_database()
    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return None
    return db.users.find_one({"_id": obj_id})


def get_all_users():
    """
    Admin function: fetch all registered users
    """
    db = get_database()
    # Optionally exclude passwords
    return list(db.users.find({}, {"password": 0}))


# ---------------------------
# Questions (optional)
# ---------------------------

def save_question(data):
    """
    Save a user's question asked for a paper
    """
    db = get_database()
    db.questions.insert_one(data)


def get_questions_by_user(user_id):
    """
    Get all questions asked by a user
    """
    db = get_database()
    return list(db.questions.find({"user_id": user_id}))


def get_questions_by_paper(paper_id):
    """
    Get all questions asked for a paper
    """
    db = get_database()
    return list(db.questions.find({"paper_id": paper_id}))