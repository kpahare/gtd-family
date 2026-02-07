from typing import List
import secrets
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.family import Family, FamilyMember, FamilyRole
from ..schemas.family import FamilyCreate, FamilyResponse, FamilyMemberResponse, FamilyJoin
from ..utils.auth import get_current_active_user

router = APIRouter()


@router.post("", response_model=FamilyResponse, status_code=status.HTTP_201_CREATED)
async def create_family(
    family_data: FamilyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    family = Family(
        name=family_data.name,
        created_by=current_user.id
    )
    db.add(family)
    db.commit()
    db.refresh(family)

    # Add creator as owner
    member = FamilyMember(
        family_id=family.id,
        user_id=current_user.id,
        role=FamilyRole.owner
    )
    db.add(member)
    db.commit()

    # Return without members to avoid needing user enrichment
    return FamilyResponse(
        id=family.id,
        name=family.name,
        created_by=family.created_by,
        invite_code=family.invite_code,
        created_at=family.created_at,
        updated_at=family.updated_at,
        members=None
    )


@router.get("", response_model=List[FamilyResponse])
async def list_families(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get all families user is a member of
    family_ids = db.query(FamilyMember.family_id).filter(
        FamilyMember.user_id == current_user.id
    ).subquery()

    families = db.query(Family).filter(Family.id.in_(family_ids)).all()
    # Return without members
    return [FamilyResponse(
        id=f.id,
        name=f.name,
        created_by=f.created_by,
        invite_code=f.invite_code,
        created_at=f.created_at,
        updated_at=f.updated_at,
        members=None
    ) for f in families]


@router.get("/{family_id}", response_model=FamilyResponse)
async def get_family(
    family_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify membership
    member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == current_user.id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this family"
        )

    family = db.query(Family).filter(Family.id == family_id).first()
    if not family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Family not found"
        )

    return FamilyResponse(
        id=family.id,
        name=family.name,
        created_by=family.created_by,
        invite_code=family.invite_code,
        created_at=family.created_at,
        updated_at=family.updated_at,
        members=None
    )


@router.post("/{family_id}/invite")
async def generate_invite(
    family_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify admin/owner role
    member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == current_user.id,
        FamilyMember.role.in_([FamilyRole.owner, FamilyRole.admin])
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners and admins can generate invites"
        )

    family = db.query(Family).filter(Family.id == family_id).first()

    # Generate new invite code
    family.invite_code = secrets.token_urlsafe(16)
    db.commit()
    db.refresh(family)

    return {"invite_code": family.invite_code}


@router.post("/join", response_model=FamilyResponse)
async def join_family(
    join_data: FamilyJoin,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    family = db.query(Family).filter(Family.invite_code == join_data.invite_code).first()

    if not family:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite code"
        )

    # Check if already a member
    existing = db.query(FamilyMember).filter(
        FamilyMember.family_id == family.id,
        FamilyMember.user_id == current_user.id
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Already a member of this family"
        )

    member = FamilyMember(
        family_id=family.id,
        user_id=current_user.id,
        role=FamilyRole.member
    )
    db.add(member)
    db.commit()

    return FamilyResponse(
        id=family.id,
        name=family.name,
        created_by=family.created_by,
        invite_code=family.invite_code,
        created_at=family.created_at,
        updated_at=family.updated_at,
        members=None
    )


@router.get("/{family_id}/members", response_model=List[FamilyMemberResponse])
async def list_members(
    family_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify membership
    member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == current_user.id
    ).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not a member of this family"
        )

    members = db.query(FamilyMember).filter(FamilyMember.family_id == family_id).all()

    # Enrich with user info
    result = []
    for m in members:
        user = db.query(User).filter(User.id == m.user_id).first()
        result.append(FamilyMemberResponse(
            id=m.id,
            user_id=m.user_id,
            user_name=user.name,
            user_email=user.email,
            role=m.role,
            joined_at=m.joined_at
        ))

    return result


@router.delete("/{family_id}/members/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def remove_member(
    family_id: str,
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify admin/owner role
    current_member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == current_user.id,
        FamilyMember.role.in_([FamilyRole.owner, FamilyRole.admin])
    ).first()

    # Allow self-removal
    is_self = user_id == current_user.id

    if not current_member and not is_self:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only owners and admins can remove members"
        )

    target_member = db.query(FamilyMember).filter(
        FamilyMember.family_id == family_id,
        FamilyMember.user_id == user_id
    ).first()

    if not target_member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found"
        )

    # Prevent removing owner
    if target_member.role == FamilyRole.owner:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot remove family owner"
        )

    db.delete(target_member)
    db.commit()
