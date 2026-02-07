from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class ReviewCreate(BaseModel):
    notes: Optional[str] = None


class ReviewResponse(BaseModel):
    id: str
    user_id: str
    completed_at: Optional[datetime]
    notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewChecklistItem(BaseModel):
    id: str
    title: str
    description: str
    completed: bool = False


class ReviewChecklist(BaseModel):
    items: List[ReviewChecklistItem]
