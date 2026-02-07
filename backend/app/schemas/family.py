from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from ..models.family import FamilyRole


class FamilyCreate(BaseModel):
    name: str


class FamilyJoin(BaseModel):
    invite_code: str


class FamilyMemberResponse(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_email: str
    role: FamilyRole
    joined_at: datetime

    class Config:
        from_attributes = True


class FamilyResponse(BaseModel):
    id: str
    name: str
    created_by: str
    invite_code: str
    created_at: datetime
    updated_at: datetime
    members: Optional[List[FamilyMemberResponse]] = None

    class Config:
        from_attributes = True
