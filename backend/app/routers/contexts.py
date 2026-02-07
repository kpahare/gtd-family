from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.context import Context
from ..schemas.context import ContextCreate, ContextUpdate, ContextResponse
from ..utils.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[ContextResponse])
async def list_contexts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    return db.query(Context).filter(Context.user_id == current_user.id).all()


@router.post("", response_model=ContextResponse, status_code=status.HTTP_201_CREATED)
async def create_context(
    context_data: ContextCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    context = Context(
        user_id=current_user.id,
        name=context_data.name,
        color=context_data.color
    )
    db.add(context)
    db.commit()
    db.refresh(context)
    return context


@router.get("/{context_id}", response_model=ContextResponse)
async def get_context(
    context_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()

    if not context:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Context not found"
        )
    return context


@router.patch("/{context_id}", response_model=ContextResponse)
async def update_context(
    context_id: str,
    context_data: ContextUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()

    if not context:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Context not found"
        )

    update_data = context_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(context, field, value)

    db.commit()
    db.refresh(context)
    return context


@router.delete("/{context_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_context(
    context_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    context = db.query(Context).filter(
        Context.id == context_id,
        Context.user_id == current_user.id
    ).first()

    if not context:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Context not found"
        )

    db.delete(context)
    db.commit()
