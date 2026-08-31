import os
import sys

# Ensure backend root is on Python path
sys.path.insert(0, os.path.realpath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.database import SessionLocal
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.device import ProductDevice
from app.models.water import WaterSource, MonitoringStation


def seed_demo_data():
    db = SessionLocal()
    try:
        print("[*] Seeding HydraSense Phase 2 Demo Data...")

        # 1. Seed Authority User
        authority_email = "authority@hydrasense.local"
        existing_authority = db.query(User).filter(User.email == authority_email).first()
        if not existing_authority:
            authority_user = User(
                email=authority_email,
                password_hash=get_password_hash("DemoAuthority123!"),
                full_name="HydraSense Authority Demo",
                role=UserRole.AUTHORITY,
                is_active=True,
            )
            db.add(authority_user)
            print(f"  [+] Created Authority User: {authority_email}")
        else:
            print(f"  [*] Authority User already exists: {authority_email}")

        # 2. Seed Product Device
        product_code = "HS-KIT-000124"
        existing_device = db.query(ProductDevice).filter(ProductDevice.product_code == product_code).first()
        if not existing_device:
            device = ProductDevice(
                product_code=product_code,
                device_id="ESP32-PERSONAL-001",
                device_type="PERSONAL_WATER_TESTER",
                status="PENDING_ACTIVATION",
                owner_id=None,
            )
            db.add(device)
            print(f"  [+] Created Unclaimed Product Device: {product_code} (ESP32-PERSONAL-001)")
        else:
            print(f"  [*] Product Device already exists: {product_code}")

        # 3. Seed Water Source (Arkavathi River)
        source_code = "ARKAVATHI"
        existing_source = db.query(WaterSource).filter(WaterSource.source_code == source_code).first()
        if not existing_source:
            water_source = WaterSource(
                source_code=source_code,
                name="Arkavathi River",
                source_type="RIVER",
                description="Major tributary of the Kaveri river basin in Karnataka providing water security monitoring.",
            )
            db.add(water_source)
            db.flush()
            print(f"  [+] Created Water Source: Arkavathi River ({source_code})")
        else:
            water_source = existing_source
            print(f"  [*] Water Source already exists: {source_code}")

        # 4. Seed Monitoring Stations
        stations_data = [
            {
                "station_code": "ARK-001",
                "station_name": "Arkavathi Upstream Station",
                "zone": "Upstream Catchment Zone",
                "location": "Hesaraghatta Reservoir Outflow",
                "latitude": 13.1558,
                "longitude": 77.4886,
                "public_warning": "NORMAL",
                "public_message": "Water quality is optimal. Source is safe under treated public distribution parameters.",
                "is_active": True,
            },
            {
                "station_code": "ARK-002",
                "station_name": "Arkavathi Midstream Station",
                "zone": "Midstream Urban Transition Zone",
                "location": "Nelamangala Junction Basin",
                "latitude": 13.0970,
                "longitude": 77.3912,
                "public_warning": "CAUTION",
                "public_message": "Moderate seasonal runoff detected. Continuous quality telemetry is active.",
                "is_active": True,
            },
            {
                "station_code": "ARK-003",
                "station_name": "Arkavathi Downstream Station",
                "zone": "Downstream Basin Zone",
                "location": "Manchanabele Inflow Checkpoint",
                "latitude": 12.8797,
                "longitude": 77.3328,
                "public_warning": "NORMAL",
                "public_message": "Safe baseline for environmental and agricultural water monitoring.",
                "is_active": True,
            },
        ]

        for s_data in stations_data:
            existing_station = db.query(MonitoringStation).filter(MonitoringStation.station_code == s_data["station_code"]).first()
            if not existing_station:
                station = MonitoringStation(
                    station_code=s_data["station_code"],
                    water_source_id=water_source.id,
                    station_name=s_data["station_name"],
                    zone=s_data["zone"],
                    location=s_data["location"],
                    latitude=s_data["latitude"],
                    longitude=s_data["longitude"],
                    public_warning=s_data["public_warning"],
                    public_message=s_data["public_message"],
                    is_active=s_data["is_active"],
                )
                db.add(station)
                print(f"  [+] Created Monitoring Station: {s_data['station_code']} - {s_data['station_name']}")
            else:
                print(f"  [*] Monitoring Station already exists: {s_data['station_code']}")

        db.commit()
        print("[SUCCESS] Demo seeding completed successfully!")
    except Exception as e:
        db.rollback()
        print(f"[ERROR] Error while seeding demo data: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_demo_data()
