import uuid
from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Context(Base):
    __tablename__ = "contexts"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    color = Column(String(7), default="#6366f1")  # Hex color

    # Relationships
    user = relationship("User", back_populates="contexts")
    items = relationship("Item", back_populates="context")
