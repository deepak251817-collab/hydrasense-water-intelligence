from app.schemas.auth import UserRegisterRequest, UserLoginRequest, TokenResponse
from app.schemas.user import UserBase, UserCreate, UserResponse
from app.schemas.device import ProductDeviceBase, ProductDeviceCreate, ProductDeviceResponse
from app.schemas.water import (
    WaterSourceResponse,
    MonitoringStationPublicResponse,
    MonitoringStationAuthorityResponse,
    LatestSensorReadingResponse,
    SensorReadingResponse,
)

__all__ = [
    "UserRegisterRequest",
    "UserLoginRequest",
    "TokenResponse",
    "UserBase",
    "UserCreate",
    "UserResponse",
    "ProductDeviceBase",
    "ProductDeviceCreate",
    "ProductDeviceResponse",
    "WaterSourceResponse",
    "MonitoringStationPublicResponse",
    "MonitoringStationAuthorityResponse",
    "LatestSensorReadingResponse",
    "SensorReadingResponse",
]
