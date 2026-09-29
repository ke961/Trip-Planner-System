from fastapi import APIRouter, HTTPException, Query
import requests

router = APIRouter(
    prefix="/destinations",
    tags=["Destinations"]
)


# -----------------------------------------
# SEARCH DESTINATIONS (geocoding)
# -----------------------------------------

@router.get("/search")
def search_destination(city: str):
    """Search for destinations using Nominatim geocoding."""

    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": city,
        "format": "json",
        "limit": 8,
        "addressdetails": 1,
        "extratags": 1,
    }

    headers = {
        "User-Agent": "TripPlanner/1.0"
    }

    try:
        response = requests.get(
            url,
            params=params,
            headers=headers,
            timeout=10
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=500,
            detail="Unable to reach geocoding service"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Unable to search destination"
        )

    data = response.json()

    results = []

    for place in data:
        address = place.get("address", {})

        results.append({
            "name": place.get("display_name"),
            "latitude": float(place["lat"]),
            "longitude": float(place["lon"]),
            "type": place.get("type", "place"),
            "category": place.get("class", ""),
            "importance": place.get("importance", 0),
            "country": address.get("country", ""),
            "country_code": address.get(
                "country_code", ""
            ).upper(),
        })

    return {"results": results}


# -----------------------------------------
# NEARBY PLACES (Overpass API / OSM)
# -----------------------------------------

CATEGORY_TAGS = {
    "restaurants": '[amenity=restaurant]',
    "hotels": '[tourism=hotel]',
    "attractions": '[tourism~"attraction|museum|viewpoint|artwork|gallery"]',
    "cafes": '[amenity=cafe]',
    "parks": '[leisure=park]',
    "shopping": '[shop~"mall|supermarket|department_store"]',
    "nightlife": '[amenity~"bar|nightclub|pub"]',
    "temples": '[amenity=place_of_worship]',
}

CATEGORY_ICONS = {
    "restaurants": "🍽️",
    "hotels": "🏨",
    "attractions": "🎭",
    "cafes": "☕",
    "parks": "🌳",
    "shopping": "🛍️",
    "nightlife": "🌙",
    "temples": "🛕",
}


@router.get("/nearby")
def get_nearby_places(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    category: str = Query(
        "attractions",
        description="Category of places"
    ),
    radius: int = Query(
        5000,
        description="Search radius in meters"
    ),
):
    """Fetch nearby points of interest using Overpass API."""

    tag_filter = CATEGORY_TAGS.get(
        category,
        '[tourism~"attraction|museum|viewpoint"]'
    )

    overpass_query = f"""
    [out:json][timeout:10];
    (
      node{tag_filter}(around:{radius},{lat},{lon});
      way{tag_filter}(around:{radius},{lat},{lon});
    );
    out center 20;
    """

    try:
        response = requests.post(
            "https://overpass-api.de/api/interpreter",
            data={"data": overpass_query},
            timeout=15,
        )
    except requests.RequestException:
        return {"places": [], "category": category}

    if response.status_code != 200:
        return {"places": [], "category": category}

    data = response.json()
    places = []

    for element in data.get("elements", []):
        tags = element.get("tags", {})
        name = tags.get("name")

        if not name:
            continue

        # Get coordinates (nodes have lat/lon, ways have center)
        place_lat = element.get(
            "lat",
            element.get("center", {}).get("lat")
        )
        place_lon = element.get(
            "lon",
            element.get("center", {}).get("lon")
        )

        if place_lat is None or place_lon is None:
            continue

        places.append({
            "name": name,
            "latitude": place_lat,
            "longitude": place_lon,
            "type": tags.get(
                "amenity",
                tags.get(
                    "tourism",
                    tags.get(
                        "leisure",
                        tags.get("shop", category)
                    )
                )
            ),
            "category": category,
            "icon": CATEGORY_ICONS.get(category, "📍"),
            "address": tags.get(
                "addr:street", ""
            ),
            "website": tags.get("website", ""),
            "phone": tags.get("phone", ""),
            "opening_hours": tags.get(
                "opening_hours", ""
            ),
            "cuisine": tags.get("cuisine", ""),
            "stars": tags.get("stars", ""),
        })

    return {
        "places": places[:20],
        "category": category,
        "total": len(places),
    }


# -----------------------------------------
# WEATHER DATA (Open-Meteo - free, no key)
# -----------------------------------------

@router.get("/weather")
def get_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
):
    """Get current weather for a location using Open-Meteo."""

    url = "https://api.open-meteo.com/v1/forecast"

    params = {
        "latitude": lat,
        "longitude": lon,
        "current": (
            "temperature_2m,relative_humidity_2m,"
            "apparent_temperature,weather_code,"
            "wind_speed_10m,is_day"
        ),
        "daily": (
            "temperature_2m_max,temperature_2m_min,"
            "weather_code,precipitation_probability_max"
        ),
        "timezone": "auto",
        "forecast_days": 5,
    }

    try:
        response = requests.get(
            url, params=params, timeout=10
        )
    except requests.RequestException:
        raise HTTPException(
            status_code=500,
            detail="Unable to fetch weather data"
        )

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail="Weather service error"
        )

    data = response.json()

    current = data.get("current", {})
    daily = data.get("daily", {})

    # Map WMO weather codes to descriptions and icons
    weather_code = current.get("weather_code", 0)
    weather_info = _get_weather_description(
        weather_code
    )

    forecast = []
    dates = daily.get("time", [])
    max_temps = daily.get("temperature_2m_max", [])
    min_temps = daily.get("temperature_2m_min", [])
    codes = daily.get("weather_code", [])
    precip = daily.get(
        "precipitation_probability_max", []
    )

    for i in range(min(5, len(dates))):
        day_info = _get_weather_description(
            codes[i] if i < len(codes) else 0
        )
        forecast.append({
            "date": dates[i] if i < len(dates) else "",
            "max_temp": (
                max_temps[i]
                if i < len(max_temps)
                else None
            ),
            "min_temp": (
                min_temps[i]
                if i < len(min_temps)
                else None
            ),
            "weather_code": (
                codes[i] if i < len(codes) else 0
            ),
            "description": day_info["description"],
            "icon": day_info["icon"],
            "precipitation_chance": (
                precip[i] if i < len(precip) else 0
            ),
        })

    return {
        "current": {
            "temperature": current.get(
                "temperature_2m"
            ),
            "feels_like": current.get(
                "apparent_temperature"
            ),
            "humidity": current.get(
                "relative_humidity_2m"
            ),
            "wind_speed": current.get(
                "wind_speed_10m"
            ),
            "weather_code": weather_code,
            "description": weather_info[
                "description"
            ],
            "icon": weather_info["icon"],
            "is_day": current.get("is_day", 1),
        },
        "forecast": forecast,
        "timezone": data.get("timezone", ""),
    }


def _get_weather_description(code):
    """Map WMO weather code to description and emoji."""

    weather_map = {
        0: {"description": "Clear sky", "icon": "☀️"},
        1: {"description": "Mainly clear", "icon": "🌤️"},
        2: {"description": "Partly cloudy", "icon": "⛅"},
        3: {"description": "Overcast", "icon": "☁️"},
        45: {"description": "Foggy", "icon": "🌫️"},
        48: {"description": "Rime fog", "icon": "🌫️"},
        51: {"description": "Light drizzle", "icon": "🌦️"},
        53: {"description": "Moderate drizzle", "icon": "🌦️"},
        55: {"description": "Dense drizzle", "icon": "🌧️"},
        61: {"description": "Slight rain", "icon": "🌦️"},
        63: {"description": "Moderate rain", "icon": "🌧️"},
        65: {"description": "Heavy rain", "icon": "🌧️"},
        71: {"description": "Slight snow", "icon": "🌨️"},
        73: {"description": "Moderate snow", "icon": "❄️"},
        75: {"description": "Heavy snow", "icon": "❄️"},
        80: {"description": "Rain showers", "icon": "🌦️"},
        81: {"description": "Moderate showers", "icon": "🌧️"},
        82: {"description": "Violent showers", "icon": "⛈️"},
        95: {"description": "Thunderstorm", "icon": "⛈️"},
        96: {"description": "Thunderstorm w/ hail", "icon": "⛈️"},
        99: {"description": "Thunderstorm w/ hail", "icon": "⛈️"},
    }

    return weather_map.get(
        code,
        {"description": "Unknown", "icon": "🌡️"}
    )