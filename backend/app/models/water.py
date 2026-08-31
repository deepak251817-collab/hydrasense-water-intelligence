from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Text, Float, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class WaterSource(Base):
    __tablename__ = "water_sources"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    source_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    source_type: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    stations: Mapped[List["MonitoringStation"]] = relationship(
        "MonitoringStation",
        back_populates="water_source",
        cascade="all, delete-orphan"
    )


class MonitoringStation(Base):
    __tablename__ = "monitoring_stations"

    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    station_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    water_source_id: Mapped[int] = mapped_column(ForeignKey("water_sources.id"), nullable=False, index=True)
    station_name: Mapped[str] = mapped_column(String(255), nullable=False)
    zone: Mapped[str] = mapped_column(String(100), nullable=False)
    location: Mapped[str] = mapped_column(String(255), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    public_warning: Mapped[str] = mapped_column(String(100), default="NORMAL", nullable=False)
    public_message: Mapped[str] = mapped_column(Text, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    water_source: Mapped["WaterSource"] = relationship("WaterSource", back_populates="stations")
