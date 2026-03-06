import os
import uuid

from .pdf_parser import extract_text_and_images
from .text_chunker import split_text
from .embeddings import generate_embedding
from .repository import save_paper, save_embedding, get_embeddings
from app.services.rag_service import search_similar
from app.services.gemini_service import ask_gemini

UPLOAD_DIR = "data/uploads"


def upload_paper(file, user):
    """
    Upload a PDF, extract text and images, generate embeddings, 
    analyze paper with Gemini, and save to DB.
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_id = str(uuid.uuid4())
    path = f"{UPLOAD_DIR}/{file_id}.pdf"

    # Save uploaded file
    with open(path, "wb") as f:
        f.write(file.file.read())

    # Extract text and images from PDF
    text, images = extract_text_and_images(path)

    # Save paper with user info (including email for admin view)
    paper_id = save_paper({
        "user_id": str(user["_id"]),           # MongoDB ID as string
        "user_email": user.get("email"),       # ✅ store email for admin
        "file_path": path,
        "content": text
    })

    # Split text into chunks and generate embeddings
    chunks = split_text(text)
    for chunk in chunks:
        emb = generate_embedding(chunk)
        save_embedding({
            "paper_id": paper_id,
            "text": chunk,
            "embedding": emb
        })

    # Generate initial AI analysis (first 12k chars)
    analysis = ask_gemini(text[:12000])

    return {
        "paper_id": paper_id,
        "analysis": analysis,
        "images_found": len(images),
        "uploaded_by": user.get("email")  # ✅ will now show correct email
    }


def ask_question(paper_id, question, user):
    """
    Ask a question about a paper using RAG + Gemini API.
    """
    # Retrieve paper embeddings
    embeddings = get_embeddings(paper_id)
    question_emb = generate_embedding(question)

    # Find relevant context
    context = search_similar(question_emb, embeddings)

    # Ask Gemini with context
    answer = ask_gemini(question, context)

    # Optional: Save question for analytics
    # save_question({
    #     "user_id": str(user["_id"]),
    #     "paper_id": paper_id,
    #     "question": question
    # })

    return answer