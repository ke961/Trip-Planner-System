from pydantic import BaseModel
from datetime import datetime


class TripCreate(BaseModel):
    title: str
    start_location: str
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    travelers: int


class TripResponse(BaseModel):
    id: int
    title: str
    start_location: str
    destination: str
    start_date: datetime
    end_date: datetime
    budget: float
    travelers: int

    class Config:
        orm_mode = True