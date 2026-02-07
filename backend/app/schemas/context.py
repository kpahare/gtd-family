from pydantic import BaseModel
from typing import Optional


class ContextCreate(BaseModel):
    name: str
    color: Optional[str] = "#6366f1"


class ContextUpdate(BaseModel):
    name: Optional[str] = None
    color: Optional[str] = None


class ContextResponse(BaseModel):
    id: str
    user_id: str
    name: str
    color: str

    class Config:
        from_attributes = True
