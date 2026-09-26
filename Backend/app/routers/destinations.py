from fastapi import APIRouter, HTTPException
import requests

router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"]
)


@router.get("/search")
def search_destination(city: str):

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": city,
        "format": "json",
        "limit": 5
    }

    headers = {
        "User-Agent": "TripPlanner/1.0"
    }

    response = requests.get(
        url,
        params=params,
        headers=headers,
        timeout=10
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Unable to search destination"
        )

    data = response.json()

    results = []

    for place in data:
        results.append({
            "name": place.get("display_name"),
            "latitude": float(place["lat"]),
            "longitude": float(place["lon"])
        })

    return {
        "results": results
    }