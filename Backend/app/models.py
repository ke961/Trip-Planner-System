from sqlalchemy import  Column, Integer, String, Float,DateTime, column
from .database import Base


class Trip(Base):
    __tablename__ = "trips"

    id = Column(Integer, primary_key=True, index=True)
    title=Column(String, nullable=False)
    start_location=Column(String, nullable=False)
    destination = Column(String, nullable=False)
    start_date = Column(DateTime , nullable=False)
    end_date = Column(DateTime, nullable=False)
    budget = Column(Float, nullable=False)
    travelers = Column(Integer, nullable=False)