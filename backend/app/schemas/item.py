from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from ..models.item import ItemType


class ItemCreate(BaseModel):
    title: str
    notes: Optional[str] = None
    type: ItemType = ItemType.inbox
    project_id: Optional[str] = None
    context_id: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class ItemUpdate(BaseModel):
    title: Optional[str] = None
    notes: Optional[str] = None
    type: Optional[ItemType] = None
    project_id: Optional[str] = None
    context_id: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class ItemProcess(BaseModel):
    type: ItemType
    project_id: Optional[str] = None
    context_id: Optional[str] = None
    assigned_to: Optional[str] = None
    due_date: Optional[datetime] = None


class ItemResponse(BaseModel):
    id: str
    user_id: str
    project_id: Optional[str]
    title: str
    notes: Optional[str]
    type: ItemType
    context_id: Optional[str]
    assigned_to: Optional[str]
    due_date: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
