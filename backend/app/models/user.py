import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from ..database import Base


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=True)  # Nullable for Google auth users
    name = Column(String(255), nullable=False)
    google_id = Column(String(255), unique=True, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = relationship("Item", back_populates="user", foreign_keys="Item.user_id")
    projects = relationship("Project", back_populates="user")
    contexts = relationship("Context", back_populates="user")
    weekly_reviews = relationship("WeeklyReview", back_populates="user")
    family_memberships = relationship("FamilyMember", back_populates="user")
    created_families = relationship("Family", back_populates="creator")
