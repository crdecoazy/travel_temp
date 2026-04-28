from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import enum
from datetime import datetime, timezone

Base = declarative_base()

class VehicleType(enum.Enum):
    SEDAN = "Sedan"
    SUV = "SUV"
    VAN = "Van"

class TripType(enum.Enum):
    ONE_WAY = "One-way"
    ROUND_TRIP = "Round trip"
    HOURLY = "Hourly rental"

class BookingStatus(enum.Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    STARTED = "Started"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    mobile_number = Column(String, unique=True, index=True)
    full_name = Column(String)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    bookings = relationship("Booking", back_populates="customer")

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    mobile_number = Column(String, unique=True, index=True)
    full_name = Column(String)
    status = Column(String, default="Available") # Available, Busy, Offline
    current_vehicle_id = Column(Integer, ForeignKey("vehicles.id"), nullable=True)
    vehicle = relationship("Vehicle", back_populates="driver", uselist=False)
    bookings = relationship("Booking", back_populates="driver")

class Vehicle(Base):
    __tablename__ = "vehicles"
    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(VehicleType, values_callable=lambda x: [e.value for e in x]))
    model = Column(String)
    capacity = Column(Integer)
    price_per_km = Column(Float)
    price_per_day = Column(Float)
    image_url = Column(String, nullable=True)
    driver = relationship("Driver", back_populates="vehicle")

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("users.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))
    trip_type = Column(Enum(TripType, values_callable=lambda x: [e.value for e in x]))
    pickup_location = Column(String)
    drop_location = Column(String)
    pickup_time = Column(DateTime)
    fare_estimate = Column(Float)
    status = Column(Enum(BookingStatus, values_callable=lambda x: [e.value for e in x]), default=BookingStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    customer = relationship("User", back_populates="bookings")
    driver = relationship("Driver", back_populates="bookings")
    vehicle = relationship("Vehicle")
