import uuid
import secrets
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from ..database import Base
import enum


def generate_uuid():
    return str(uuid.uuid4())


class FamilyRole(str, enum.Enum):
    owner = "owner"
    admin = "admin"
    member = "member"


class Family(Base):
    __tablename__ = "families"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    created_by = Column(String(36), ForeignKey("users.id"), nullable=False)
    invite_code = Column(String(32), unique=True, default=lambda: secrets.token_urlsafe(16))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User", back_populates="created_families")
    members = relationship("FamilyMember", back_populates="family", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="family")


class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    family_id = Column(String(36), ForeignKey("families.id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    role = Column(Enum(FamilyRole), default=FamilyRole.member, nullable=False)
    joined_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    family = relationship("Family", back_populates="members")
    user = relationship("User", back_populates="family_memberships")
