from fastapi import APIRouter, UploadFile, File, Depends
from .service import upload_paper, ask_question
from .schemas import AskQuestion
from app.dependencie.auth_dependencies import get_current_user, require_role
from .repository import get_all_papers as get_all_papers_repo

router = APIRouter()


# ---------------------------
# Upload paper (accessible to regular users)
# ---------------------------
@router.post("/upload")
def upload(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload a PDF paper. Saves file, extracts text/images, generates embeddings.
    Tracks which user uploaded it.
    """
    return upload_paper(file, user)


# ---------------------------
# Ask question about a paper (accessible to regular users)
# ---------------------------
@router.post("/ask")
def ask(
    data: AskQuestion,
    user: dict = Depends(get_current_user)
):
    """
    Ask a question about a specific paper.
    Returns AI-generated answer based on paper content.
    """
    answer = ask_question(data.paper_id, data.question, user)
    return {"answer": answer}


# ---------------------------
# Admin endpoint to get minimal info about all uploaded papers
# ---------------------------
@router.get("/admin/papers")
def get_all_papers(user: dict = Depends(require_role("admin"))):
    """
    Admin-only endpoint.
    Returns a list of all papers with minimal info:
      - paper ID
      - uploader's email
      - filename only (no content)
    """
    papers = get_all_papers_repo()

    # Prepare minimal paper info
    minimal_papers = []
    for paper in papers:
        paper_info = {
            "paper_id": str(paper["_id"]),
            "uploaded_by": paper.get("user_email", "Unknown"),
            "file_name": paper.get("file_path", "").split("/")[-1]  # Extract just the filename
        }
        minimal_papers.append(paper_info)

    return {
        "total": len(minimal_papers),
        "papers": minimal_papers
    }