import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, ForeignKey, Text, String
from sqlalchemy.orm import relationship
from ..database import Base


def generate_uuid():
    return str(uuid.uuid4())


class WeeklyReview(Base):
    __tablename__ = "weekly_reviews"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="weekly_reviews")
