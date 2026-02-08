from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.item import Item, ItemType, ItemPriority
from ..schemas.item import ItemCreate, ItemUpdate, ItemResponse, ItemProcess
from ..utils.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[ItemResponse])
async def list_items(
    type: Optional[ItemType] = None,
    project_id: Optional[str] = None,
    context_id: Optional[str] = None,
    priority: Optional[ItemPriority] = None,
    include_completed: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    query = db.query(Item).filter(Item.user_id == current_user.id)

    if type:
        query = query.filter(Item.type == type)
    if project_id:
        query = query.filter(Item.project_id == project_id)
    if context_id:
        query = query.filter(Item.context_id == context_id)
    if priority:
        query = query.filter(Item.priority == priority)
    if not include_completed:
        query = query.filter(Item.completed_at.is_(None))

    return query.order_by(Item.created_at.desc()).all()


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(
    item_data: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = Item(
        user_id=current_user.id,
        title=item_data.title,
        notes=item_data.notes,
        type=item_data.type,
        project_id=item_data.project_id,
        context_id=item_data.context_id,
        assigned_to=item_data.assigned_to,
        priority=item_data.priority,
        due_date=item_data.due_date
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )
    return item


@router.patch("/{item_id}", response_model=ItemResponse)
async def update_item(
    item_id: str,
    item_data: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    update_data = item_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)

    db.commit()
    db.refresh(item)
    return item


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    db.delete(item)
    db.commit()


@router.post("/{item_id}/complete", response_model=ItemResponse)
async def complete_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.user_id == current_user.id
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found"
        )

    item.completed_at = datetime.utcnow()
    db.commit()
    db.refresh(item)
    return item


@router.post("/{item_id}/process", response_model=ItemResponse)
async def process_item(
    item_id: str,
    process_data: ItemProcess,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(
        Item.id == item_id,
        Item.user_id == current_user.id,
        Item.type == ItemType.inbox
    ).first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inbox item not found"
        )

    item.type = process_data.type
    if process_data.project_id:
        item.project_id = process_data.project_id
    if process_data.context_id:
        item.context_id = process_data.context_id
    if process_data.assigned_to:
        item.assigned_to = process_data.assigned_to
    if process_data.priority:
        item.priority = process_data.priority
    if process_data.due_date:
        item.due_date = process_data.due_date

    db.commit()
    db.refresh(item)
    return item
