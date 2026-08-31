from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from app.api.deps import get_current_authority
from app.core.database import get_db
from app.models.user import User
from app.models.water import MonitoringStation
from app.schemas.user import UserResponse
from app.schemas.water import MonitoringStationAuthorityResponse

router = APIRouter(prefix="/authority", tags=["Authority"])


@router.get("/me", response_model=UserResponse)
def get_authority_profile(
    current_user: User = Depends(get_current_authority)
):
    return current_user


@router.get("/stations", response_model=List[MonitoringStationAuthorityResponse])
def get_all_monitoring_stations(
    current_user: User = Depends(get_current_authority),
    db: Session = Depends(get_db)
):
    stations = (
        db.query(MonitoringStation)
        .options(joinedload(MonitoringStation.water_source))
        .all()
    )
    return stations
