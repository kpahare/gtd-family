import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.orm import relationship
from ..database import Base
import enum


def generate_uuid():
    return str(uuid.uuid4())


class ItemPriority(str, enum.Enum):
    p1 = "p1"
    p2 = "p2"
    p3 = "p3"
    p4 = "p4"


class ItemType(str, enum.Enum):
    inbox = "inbox"
    next_action = "next_action"
    waiting_for = "waiting_for"
    scheduled = "scheduled"
    someday = "someday"
    reference = "reference"


class Item(Base):
    __tablename__ = "items"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=True)
    title = Column(String(500), nullable=False)
    notes = Column(Text, nullable=True)
    type = Column(Enum(ItemType), default=ItemType.inbox, nullable=False)
    context_id = Column(String(36), ForeignKey("contexts.id"), nullable=True)
    assigned_to = Column(String(36), ForeignKey("users.id"), nullable=True)
    priority = Column(Enum(ItemPriority), nullable=True)
    due_date = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="items", foreign_keys=[user_id])
    project = relationship("Project", back_populates="items")
    context = relationship("Context", back_populates="items")
    assignee = relationship("User", foreign_keys=[assigned_to])
