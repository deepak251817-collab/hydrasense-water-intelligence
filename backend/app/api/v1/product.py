from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_current_product_user
from app.core.database import get_db
from app.models.user import User
from app.models.device import ProductDevice
from app.schemas.user import UserResponse
from app.schemas.device import ProductDeviceResponse

router = APIRouter(prefix="/product", tags=["Product User"])


@router.get("/me", response_model=UserResponse)
def get_my_profile(
    current_user: User = Depends(get_current_product_user)
):
    return current_user


@router.get("/devices", response_model=List[ProductDeviceResponse])
def get_my_devices(
    current_user: User = Depends(get_current_product_user),
    db: Session = Depends(get_db)
):
    devices = (
        db.query(ProductDevice)
        .filter(ProductDevice.owner_id == current_user.id)
        .all()
    )
    return devices
