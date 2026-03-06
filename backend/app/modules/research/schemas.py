from pydantic import BaseModel


class AskQuestion(BaseModel):

    paper_id: str
    question: str