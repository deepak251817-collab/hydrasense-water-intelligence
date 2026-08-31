from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.core.database import get_db
from app.models.water import MonitoringStation
from app.schemas.water import MonitoringStationPublicResponse

router = APIRouter(prefix="/public", tags=["Public"])


@router.get("/stations/{station_code}", response_model=MonitoringStationPublicResponse)
def get_public_station(station_code: str, db: Session = Depends(get_db)):
    station = (
        db.query(MonitoringStation)
        .options(joinedload(MonitoringStation.water_source))
        .filter(MonitoringStation.station_code == station_code)
        .first()
    )
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Monitoring station with code '{station_code}' not found"
        )
    return station
