from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import connect_to_mongo
from app.modules.auth.router import router as auth_router
from app.modules.research.router import router as research_router

app = FastAPI(
    title="AI Research Assistant",
    description="AI powered platform for research paper analysis using Gemini",
    version="1.0.0"
)

# ---------------------------
# CORS Configuration
# ---------------------------
origins = [
    "http://localhost:5173",  # Vite frontend
    "http://127.0.0.1:5173"   # Optional
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,  # Must be True for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------
# Startup Event
# ---------------------------
@app.on_event("startup")
def startup():
    connect_to_mongo()
    print("🚀 Server started successfully")

# ---------------------------
# Root API
# ---------------------------
@app.get("/")
def home():
    return {
        "message": "AI Research Assistant API Running",
        "docs": "/docs"
    }

# ---------------------------
# Include Routers
# ---------------------------
app.include_router(auth_router, prefix="/api/auth")       # /api/auth/register, /api/auth/login, etc.
app.include_router(research_router, prefix="/api/research") # /api/research/...