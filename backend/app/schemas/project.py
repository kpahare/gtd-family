from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List
from ..models.project import ProjectStatus, ProjectHorizon


class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    status: ProjectStatus = ProjectStatus.active
    horizon: ProjectHorizon = ProjectHorizon.project
    family_id: Optional[str] = None
    parent_id: Optional[str] = None


class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    status: Optional[ProjectStatus] = None
    horizon: Optional[ProjectHorizon] = None
    family_id: Optional[str] = None
    parent_id: Optional[str] = None


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    family_id: Optional[str]
    name: str
    description: Optional[str]
    status: ProjectStatus
    horizon: ProjectHorizon
    parent_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectWithChildren(ProjectResponse):
    children: List["ProjectWithChildren"] = []
    item_count: int = 0
    completed_item_count: int = 0
