from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from . import models
from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

DATABASE_URL = "sqlite:///./travel_business.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = Session(bind=engine)
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="Travel Business API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class LoginRequest(BaseModel):
    mobile_number: str

class LoginResponse(BaseModel):
    user_id: int
    full_name: str

class VehicleBase(BaseModel):
    type: str
    model: str
    capacity: int
    price_per_km: float
    price_per_day: float
    image_url: Optional[str] = None

class VehicleCreate(VehicleBase):
    pass

class Vehicle(VehicleBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

class BookingCreate(BaseModel):
    customer_id: int
    vehicle_id: int
    trip_type: str
    pickup_location: str
    drop_location: str
    pickup_time: datetime

class BookingResponse(BaseModel):
    id: int
    customer_id: int
    vehicle_id: int
    trip_type: str
    pickup_location: str
    drop_location: str
    pickup_time: datetime
    status: str
    fare_estimate: float
    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_orm_with_enums(cls, obj):
        data = {c.name: getattr(obj, c.name) for c in obj.__table__.columns}
        data['status'] = obj.status.value
        data['trip_type'] = obj.trip_type.value
        return cls(**data)

class DriverBase(BaseModel):
    full_name: str
    mobile_number: str

class DriverCreate(DriverBase):
    pass

class Driver(DriverBase):
    id: int
    status: str
    model_config = ConfigDict(from_attributes=True)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.mobile_number == login_data.mobile_number).first()
    if not user:
        # For simplicity, create user if not exists (Mock OTP)
        user = models.User(mobile_number=login_data.mobile_number, full_name="User " + login_data.mobile_number)
        db.add(user)
        db.commit()
        db.refresh(user)
    return {"user_id": user.id, "full_name": user.full_name}

# --- User Routes ---

@app.get("/vehicles", response_model=List[Vehicle])
def list_vehicles(db: Session = Depends(get_db)):
    vehicles = db.query(models.Vehicle).all()
    # Pydantic will handle the Enum to string conversion if the model is set up right,
    # but since our models use Enum classes, we might need a little help or use .value
    res = []
    for v in vehicles:
        v_dict = {c.name: getattr(v, c.name) for c in v.__table__.columns}
        v_dict['type'] = v.type.value
        res.append(v_dict)
    return res

@app.post("/bookings", response_model=BookingResponse)
def create_booking(booking: BookingCreate, db: Session = Depends(get_db)):
    vehicle = db.query(models.Vehicle).filter(models.Vehicle.id == booking.vehicle_id).first()
    if not vehicle:
        raise HTTPException(status_code=404, detail="Vehicle not found")

    fare_estimate = 500.0 # Placeholder

    db_booking = models.Booking(
        customer_id=booking.customer_id,
        vehicle_id=booking.vehicle_id,
        trip_type=booking.trip_type,
        pickup_location=booking.pickup_location,
        drop_location=booking.drop_location,
        pickup_time=booking.pickup_time,
        fare_estimate=fare_estimate,
        status=models.BookingStatus.PENDING
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)

    return BookingResponse.from_orm_with_enums(db_booking)

# --- Admin Routes ---

@app.get("/admin/bookings", response_model=List[BookingResponse])
def get_all_bookings(db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).all()
    return [BookingResponse.from_orm_with_enums(b) for b in bookings]

@app.post("/admin/vehicles", response_model=Vehicle)
def add_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = models.Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    v_dict = {c.name: getattr(db_vehicle, c.name) for c in db_vehicle.__table__.columns}
    v_dict['type'] = db_vehicle.type.value
    return v_dict

@app.post("/admin/drivers", response_model=Driver)
def add_driver(driver: DriverCreate, db: Session = Depends(get_db)):
    db_driver = models.Driver(**driver.dict())
    db.add(db_driver)
    db.commit()
    db.refresh(db_driver)
    return db_driver
