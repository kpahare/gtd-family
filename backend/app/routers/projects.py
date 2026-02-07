from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.user import User
from ..models.project import Project, ProjectStatus, ProjectHorizon
from ..models.family import FamilyMember
from ..schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from ..utils.auth import get_current_active_user

router = APIRouter()


@router.get("", response_model=List[ProjectResponse])
async def list_projects(
    horizon: Optional[ProjectHorizon] = None,
    status: Optional[ProjectStatus] = None,
    family_id: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get user's personal projects and family projects they have access to
    query = db.query(Project).filter(
        (Project.user_id == current_user.id) |
        (Project.family_id.in_(
            db.query(FamilyMember.family_id).filter(
                FamilyMember.user_id == current_user.id
            )
        ))
    )

    if horizon:
        query = query.filter(Project.horizon == horizon)
    if status:
        query = query.filter(Project.status == status)
    if family_id:
        query = query.filter(Project.family_id == family_id)

    return query.order_by(Project.created_at.desc()).all()


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Verify family access if family_id provided
    if project_data.family_id:
        member = db.query(FamilyMember).filter(
            FamilyMember.family_id == project_data.family_id,
            FamilyMember.user_id == current_user.id
        ).first()
        if not member:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not a member of this family"
            )

    project = Project(
        user_id=current_user.id,
        name=project_data.name,
        description=project_data.description,
        status=project_data.status,
        horizon=project_data.horizon,
        family_id=project_data.family_id,
        parent_id=project_data.parent_id
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    project = db.query(Project).filter(Project.id == project_id).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    # Check access
    has_access = project.user_id == current_user.id
    if project.family_id and not has_access:
        member = db.query(FamilyMember).filter(
            FamilyMember.family_id == project.family_id,
            FamilyMember.user_id == current_user.id
        ).first()
        has_access = member is not None

    if not has_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )

    return project


@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_data: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    update_data = project_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()
