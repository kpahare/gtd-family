from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.review import WeeklyReview
from ..schemas.review import ReviewCreate, ReviewResponse, ReviewChecklist, ReviewChecklistItem
from ..utils.auth import get_current_active_user

router = APIRouter()


@router.get("/checklist", response_model=ReviewChecklist)
async def get_review_checklist(
    current_user: User = Depends(get_current_active_user)
):
    checklist_items = [
        ReviewChecklistItem(
            id="clear_inbox",
            title="Clear Inbox to Zero",
            description="Process all items in your inbox - decide what each item is and what to do with it"
        ),
        ReviewChecklistItem(
            id="review_next_actions",
            title="Review Next Actions",
            description="Review all next action lists for each context - mark complete, update, or delete"
        ),
        ReviewChecklistItem(
            id="review_waiting_for",
            title="Review Waiting For",
            description="Check on delegated items - follow up on anything overdue"
        ),
        ReviewChecklistItem(
            id="review_projects",
            title="Review Projects",
            description="Review each project - ensure at least one next action exists for active projects"
        ),
        ReviewChecklistItem(
            id="review_someday",
            title="Review Someday/Maybe",
            description="Review someday/maybe list - move items to active if appropriate"
        ),
        ReviewChecklistItem(
            id="review_calendar",
            title="Review Calendar",
            description="Review past and upcoming calendar events - capture any actions needed"
        ),
        ReviewChecklistItem(
            id="review_goals",
            title="Review Goals & Vision",
            description="Review higher horizons - ensure projects align with goals"
        ),
    ]

    return ReviewChecklist(items=checklist_items)


@router.post("", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
async def create_review(
    review_data: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    review = WeeklyReview(
        user_id=current_user.id,
        notes=review_data.notes,
        completed_at=datetime.utcnow()
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("", response_model=List[ReviewResponse])
async def list_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(WeeklyReview).filter(
        WeeklyReview.user_id == current_user.id
    ).order_by(WeeklyReview.created_at.desc()).all()


@router.get("/{review_id}", response_model=ReviewResponse)
async def get_review(
    review_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    review = db.query(WeeklyReview).filter(
        WeeklyReview.id == review_id,
        WeeklyReview.user_id == current_user.id
    ).first()

    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    return review
