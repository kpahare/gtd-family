import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from ..database import Base
import enum


def generate_uuid():
    return str(uuid.uuid4())


class ProjectStatus(str, enum.Enum):
    active = "active"
    completed = "completed"
    someday = "someday"


class ProjectHorizon(str, enum.Enum):
    project = "project"
    area = "area"
    goal = "goal"
    vision = "vision"
    purpose = "purpose"


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    family_id = Column(String(36), ForeignKey("families.id"), nullable=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(ProjectStatus), default=ProjectStatus.active, nullable=False)
    horizon = Column(Enum(ProjectHorizon), default=ProjectHorizon.project, nullable=False)
    parent_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="projects")
    family = relationship("Family", back_populates="projects")
    parent = relationship("Project", remote_side=[id], backref="children")
    items = relationship("Item", back_populates="project")
