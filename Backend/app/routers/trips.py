from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import models, schema


router = APIRouter(
    prefix="/trips",
    tags=["Trips"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=schema.TripResponse)
def create_trip(
    trip: schema.TripCreate,
    db: Session = Depends(get_db)
):
    new_trip = models.Trip(
        title=trip.title,
        start_location=trip.start_location,
        destination=trip.destination,
        start_date=trip.start_date,
        end_date=trip.end_date,
        budget=trip.budget,
        travelers=trip.travelers
    )

    db.add(new_trip)
    db.commit()
    db.refresh(new_trip)

    return new_trip


@router.get("/", response_model=list[schema.TripResponse])
def get_trips(db: Session = Depends(get_db)):
    trips = db.query(models.Trip).all()

    return trips


@router.get("/{trip_id}", response_model=schema.TripResponse)
def get_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    return trip


@router.put("/{trip_id}", response_model=schema.TripResponse)
def update_trip(
    trip_id: int,
    updated_trip: schema.TripCreate,
    db: Session = Depends(get_db)
):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    trip.title = updated_trip.title
    trip.start_location = updated_trip.start_location
    trip.destination = updated_trip.destination
    trip.start_date = updated_trip.start_date
    trip.end_date = updated_trip.end_date
    trip.budget = updated_trip.budget
    trip.travelers = updated_trip.travelers

    db.commit()
    db.refresh(trip)

    return trip


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    db: Session = Depends(get_db)
):
    trip = db.query(models.Trip).filter(
        models.Trip.id == trip_id
    ).first()

    if not trip:
        raise HTTPException(
            status_code=404,
            detail="Trip not found"
        )

    db.delete(trip)
    db.commit()

    return {
        "message": "Trip deleted successfully"
    }