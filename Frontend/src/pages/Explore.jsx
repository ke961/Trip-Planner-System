import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  CircleMarker,
  Tooltip,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./Explore.css";


// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// -----------------------------------------
// CONSTANTS
// -----------------------------------------

const API_BASE = "http://127.0.0.1:8000";

const CATEGORIES = [
  { key: "attractions", label: "Attractions", icon: "🎭" },
  { key: "restaurants", label: "Restaurants", icon: "🍽️" },
  { key: "hotels", label: "Hotels", icon: "🏨" },
  { key: "cafes", label: "Cafés", icon: "☕" },
  { key: "parks", label: "Parks", icon: "🌳" },
  { key: "shopping", label: "Shopping", icon: "🛍️" },
  { key: "nightlife", label: "Nightlife", icon: "🌙" },
  { key: "temples", label: "Temples", icon: "🛕" },
];

const CATEGORY_COLORS = {
  attractions: "#a78bfa",
  restaurants: "#f97316",
  hotels: "#06b6d4",
  cafes: "#d97706",
  parks: "#22c55e",
  shopping: "#ec4899",
  nightlife: "#8b5cf6",
  temples: "#ef4444",
};

const MAP_STYLES = [
  {
    key: "standard",
    label: "Standard",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
  },
  {
    key: "dark",
    label: "Dark",
    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
    attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>',
  },
  {
    key: "satellite",
    label: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  {
    key: "topo",
    label: "Terrain",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap",
  },
];

const QUICK_DESTINATIONS = [
  { name: "Tokyo", country: "Japan", emoji: "🗼" },
  { name: "Paris", country: "France", emoji: "🗼" },
  { name: "New York", country: "USA", emoji: "🗽" },
  { name: "Dubai", country: "UAE", emoji: "🏙️" },
  { name: "London", country: "UK", emoji: "🎡" },
  { name: "Seoul", country: "South Korea", emoji: "🏯" },
  { name: "Sydney", country: "Australia", emoji: "🏖️" },
  { name: "Rome", country: "Italy", emoji: "🏛️" },
];


// -----------------------------------------
// MAP CONTROLLER
// -----------------------------------------

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;

    map.flyTo(position, 13, {
      duration: 1.5,
      easeLinearity: 0.25,
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 300);
  }, [position, map]);

  return null;
}


// -----------------------------------------
// MAP RESIZE
// -----------------------------------------

function MapResize() {
  const map = useMap();

  useEffect(() => {
    const resizeMap = () => {
      map.invalidateSize();
    };

    setTimeout(resizeMap, 100);
    setTimeout(resizeMap, 500);

    window.addEventListener("resize", resizeMap);

    return () => {
      window.removeEventListener("resize", resizeMap);
    };
  }, [map]);

  return null;
}


// -----------------------------------------
// WEATHER WIDGET
// -----------------------------------------

function WeatherWidget({ weather, loading }) {
  if (loading) {
    return (
      <div className="weather-widget weather-loading">
        <div className="weather-shimmer" />
        <span>Loading weather...</span>
      </div>
    );
  }

  if (!weather || !weather.current) {
    return null;
  }

  const { current, forecast } = weather;

  return (
    <div className="weather-widget">

      <div className="weather-current">
        <div className="weather-main">
          <span className="weather-icon-large">
            {current.icon}
          </span>
          <div>
            <div className="weather-temp">
              {Math.round(current.temperature)}°C
            </div>
            <div className="weather-desc">
              {current.description}
            </div>
          </div>
        </div>

        <div className="weather-details">
          <div className="weather-detail">
            <span className="detail-icon">🌡️</span>
            <span>Feels {Math.round(current.feels_like)}°</span>
          </div>
          <div className="weather-detail">
            <span className="detail-icon">💧</span>
            <span>{current.humidity}%</span>
          </div>
          <div className="weather-detail">
            <span className="detail-icon">💨</span>
            <span>{current.wind_speed} km/h</span>
          </div>
        </div>
      </div>

      {forecast && forecast.length > 0 && (
        <div className="weather-forecast">
          {forecast.slice(0, 5).map((day, i) => (
            <div key={i} className="forecast-day">
              <span className="forecast-date">
                {i === 0
                  ? "Today"
                  : new Date(day.date).toLocaleDateString(
                      "en",
                      { weekday: "short" }
                    )}
              </span>
              <span className="forecast-icon">
                {day.icon}
              </span>
              <span className="forecast-temps">
                <span className="temp-high">
                  {Math.round(day.max_temp)}°
                </span>
                <span className="temp-low">
                  {Math.round(day.min_temp)}°
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// -----------------------------------------
// PLACE CARD
// -----------------------------------------

function PlaceCard({ place, onSelect, isActive }) {
  return (
    <button
      className={`place-card ${isActive ? "place-card--active" : ""}`}
      onClick={() => onSelect(place)}
    >
      <div
        className="place-card-accent"
        style={{
          background: CATEGORY_COLORS[place.category] || "#6366f1",
        }}
      />

      <div className="place-card-icon">
        {place.icon || "📍"}
      </div>

      <div className="place-card-content">
        <h4>{place.name}</h4>
        {place.cuisine && (
          <span className="place-tag">
            {place.cuisine.split(";")[0]}
          </span>
        )}
        {place.address && (
          <p className="place-address">{place.address}</p>
        )}
        {place.opening_hours && (
          <p className="place-hours">
            🕐 {place.opening_hours}
          </p>
        )}
        {place.stars && (
          <p className="place-stars">
            {"⭐".repeat(
              Math.min(parseInt(place.stars) || 0, 5)
            )}
          </p>
        )}
      </div>

      <span className="place-card-arrow">→</span>
    </button>
  );
}


// -----------------------------------------
// EXPLORE PAGE
// -----------------------------------------

function Explore() {
  const [searchParams] = useSearchParams();

  // Core state
  const [city, setCity] = useState("");
  const [position, setPosition] = useState([23.8103, 90.4125]);
  const [placeName, setPlaceName] = useState("Dhaka, Bangladesh");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Enhanced state
  const [activeCategory, setActiveCategory] = useState("attractions");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [mapStyle, setMapStyle] = useState("standard");
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState("search");

  const searchInputRef = useRef(null);


  // -----------------------------------------
  // FETCH WEATHER
  // -----------------------------------------

  const fetchWeather = useCallback(async (lat, lon) => {
    setWeatherLoading(true);

    try {
      const response = await fetch(
        `${API_BASE}/destinations/weather?lat=${lat}&lon=${lon}`
      );

      if (!response.ok) throw new Error("Weather fetch failed");

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error("Weather error:", err);
      setWeather(null);
    } finally {
      setWeatherLoading(false);
    }
  }, []);


  // -----------------------------------------
  // FETCH NEARBY PLACES
  // -----------------------------------------

  const fetchNearbyPlaces = useCallback(
    async (lat, lon, category = activeCategory) => {
      setNearbyLoading(true);

      try {
        const response = await fetch(
          `${API_BASE}/destinations/nearby?lat=${lat}&lon=${lon}&category=${category}&radius=5000`
        );

        if (!response.ok) throw new Error("Nearby fetch failed");

        const data = await response.json();
        setNearbyPlaces(data.places || []);
      } catch (err) {
        console.error("Nearby places error:", err);
        setNearbyPlaces([]);
      } finally {
        setNearbyLoading(false);
      }
    },
    [activeCategory]
  );


  // -----------------------------------------
  // SEARCH DESTINATION
  // -----------------------------------------

  const searchDestination = async (searchValue = city) => {
    const destination = searchValue.trim();

    if (!destination) {
      setError("Please enter a destination.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE}/destinations/search?city=${encodeURIComponent(
          destination
        )}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      const searchResults = Array.isArray(data.results)
        ? data.results
        : [];

      setResults(searchResults);

      if (searchResults.length === 0) {
        setError(
          `No destinations found for "${destination}".`
        );
        return;
      }

      const firstPlace = searchResults[0];

      const latitude = Number(firstPlace.latitude);
      const longitude = Number(firstPlace.longitude);

      if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        throw new Error("Invalid coordinates received.");
      }

      setPosition([latitude, longitude]);
      setPlaceName(firstPlace.name || destination);
      setActiveTab("nearby");

      // Fetch weather and nearby in parallel
      fetchWeather(latitude, longitude);
      fetchNearbyPlaces(latitude, longitude);
    } catch (err) {
      console.error("Destination search error:", err);

      setError(
        "Unable to search destination. Make sure your backend server is running."
      );

      setResults([]);
    } finally {
      setLoading(false);
    }
  };


  // -----------------------------------------
  // SELECT DESTINATION
  // -----------------------------------------

  const selectDestination = (place) => {
    const latitude = Number(place.latitude);
    const longitude = Number(place.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    setPosition([latitude, longitude]);
    setPlaceName(place.name || "Selected location");
    setSelectedPlace(place);

    // Fetch data for new position
    fetchWeather(latitude, longitude);
    fetchNearbyPlaces(latitude, longitude);
  };


  // -----------------------------------------
  // SELECT NEARBY PLACE
  // -----------------------------------------

  const selectNearbyPlace = (place) => {
    const latitude = Number(place.latitude);
    const longitude = Number(place.longitude);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) return;

    setPosition([latitude, longitude]);
    setSelectedPlace(place);
  };


  // -----------------------------------------
  // CATEGORY CHANGE
  // -----------------------------------------

  const handleCategoryChange = (categoryKey) => {
    setActiveCategory(categoryKey);
    fetchNearbyPlaces(position[0], position[1], categoryKey);
  };


  // -----------------------------------------
  // QUICK DESTINATION
  // -----------------------------------------

  const handleQuickDestination = (dest) => {
    setCity(dest.name);
    searchDestination(dest.name);
  };


  // -----------------------------------------
  // READ ?city= FROM HOME PAGE
  // -----------------------------------------

  useEffect(() => {
    const cityFromUrl = searchParams.get("city");

    if (!cityFromUrl) return;

    setCity(cityFromUrl);
    searchDestination(cityFromUrl);
  }, [searchParams]);


  // -----------------------------------------
  // CURRENT MAP STYLE
  // -----------------------------------------

  const currentMapStyle =
    MAP_STYLES.find((s) => s.key === mapStyle) || MAP_STYLES[0];


  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <main className="explore-page">

      {/* ========== HERO HEADER ========== */}

      <div className="explore-hero">

        <div className="explore-hero-glow" />

        <div className="explore-hero-content">

          <span className="explore-hero-badge">
            <span className="badge-dot" />
            DISCOVER THE WORLD
          </span>

          <h1>
            Explore <span className="gradient-text">Destinations</span>
          </h1>

          <p className="explore-hero-subtitle">
            Search any destination on earth — discover attractions,
            restaurants, weather, and more with our interactive explorer.
          </p>


          {/* SEARCH BAR */}

          <div className="explore-search-container">

            <div className="explore-search-bar">

              <span className="explore-search-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </span>

              <input
                ref={searchInputRef}
                id="explore-search-input"
                type="text"
                placeholder="Search a city, landmark, or country..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") searchDestination();
                }}
              />

              <button
                id="explore-search-btn"
                className="explore-search-btn"
                onClick={() => searchDestination()}
                disabled={loading}
              >
                {loading ? (
                  <span className="btn-spinner" />
                ) : (
                  "Explore"
                )}
              </button>

            </div>

          </div>


          {/* QUICK DESTINATIONS */}

          <div className="quick-destinations">
            <span className="quick-label">Popular:</span>
            {QUICK_DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                className="quick-chip"
                onClick={() => handleQuickDestination(dest)}
              >
                <span>{dest.emoji}</span>
                {dest.name}
              </button>
            ))}
          </div>

        </div>

      </div>


      {/* ========== ERROR ========== */}

      {error && (
        <div className="explore-error">
          <span className="error-icon">⚠️</span>
          {error}
          <button
            className="error-dismiss"
            onClick={() => setError("")}
          >
            ✕
          </button>
        </div>
      )}


      {/* ========== MAIN CONTENT ========== */}

      <div className="explore-main">

        {/* ---------- SIDEBAR ---------- */}

        <aside className={`explore-sidebar ${showSidebar ? "" : "sidebar-collapsed"}`}>

          <button
            className="sidebar-toggle"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "Collapse" : "Expand"}
          >
            {showSidebar ? "◀" : "▶"}
          </button>

          {showSidebar && (
            <>

              {/* TAB NAVIGATION */}

              <div className="sidebar-tabs">

                <button
                  className={`sidebar-tab ${activeTab === "search" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("search")}
                >
                  <span>🔍</span>
                  Results
                  {results.length > 0 && (
                    <span className="tab-count">{results.length}</span>
                  )}
                </button>

                <button
                  className={`sidebar-tab ${activeTab === "nearby" ? "tab-active" : ""}`}
                  onClick={() => setActiveTab("nearby")}
                >
                  <span>📍</span>
                  Nearby
                  {nearbyPlaces.length > 0 && (
                    <span className="tab-count">{nearbyPlaces.length}</span>
                  )}
                </button>

              </div>


              {/* SEARCH RESULTS TAB */}

              {activeTab === "search" && (
                <div className="sidebar-content">

                  {results.length === 0 ? (

                    <div className="empty-state">
                      <div className="empty-icon-wrapper">
                        <span className="explore-empty-icon">🌍</span>
                      </div>
                      <h3>Find a destination</h3>
                      <p>
                        Search for any city or place to start
                        exploring the world.
                      </p>
                    </div>

                  ) : (

                    <div className="results-list">
                      {results.map((place, index) => (

                        <button
                          key={`${place.name}-${index}`}
                          className={`result-card ${
                            selectedPlace?.name === place.name
                              ? "result-card--active"
                              : ""
                          }`}
                          onClick={() => selectDestination(place)}
                        >

                          <div className="result-rank">
                            {index + 1}
                          </div>

                          <div className="result-info">
                            <h4>
                              {place.name?.split(",")[0] ||
                                "Unknown location"}
                            </h4>
                            <p>{place.name || "Unknown location"}</p>
                            {place.country && (
                              <span className="result-country">
                                {place.country_code && (
                                  <img
                                    src={`https://flagcdn.com/16x12/${place.country_code.toLowerCase()}.png`}
                                    alt=""
                                    className="country-flag"
                                  />
                                )}
                                {place.country}
                              </span>
                            )}
                          </div>

                          <span className="result-arrow">→</span>

                        </button>

                      ))}
                    </div>

                  )}

                </div>
              )}


              {/* NEARBY PLACES TAB */}

              {activeTab === "nearby" && (
                <div className="sidebar-content">

                  {/* Category filter pills */}

                  <div className="category-filters">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.key}
                        className={`category-pill ${
                          activeCategory === cat.key
                            ? "pill-active"
                            : ""
                        }`}
                        onClick={() =>
                          handleCategoryChange(cat.key)
                        }
                        style={
                          activeCategory === cat.key
                            ? {
                                background:
                                  CATEGORY_COLORS[cat.key],
                                borderColor:
                                  CATEGORY_COLORS[cat.key],
                              }
                            : {}
                        }
                      >
                        <span>{cat.icon}</span>
                        {cat.label}
                      </button>
                    ))}
                  </div>


                  {/* Nearby places list */}

                  {nearbyLoading ? (

                    <div className="loading-state">
                      <div className="loading-spinner" />
                      <span>Discovering places...</span>
                    </div>

                  ) : nearbyPlaces.length === 0 ? (

                    <div className="empty-state">
                      <div className="empty-icon-wrapper">
                        <span className="explore-empty-icon">
                          {CATEGORIES.find(
                            (c) => c.key === activeCategory
                          )?.icon || "📍"}
                        </span>
                      </div>
                      <h3>No places found</h3>
                      <p>
                        Try searching for a destination first,
                        or choose a different category.
                      </p>
                    </div>

                  ) : (

                    <div className="nearby-list">
                      {nearbyPlaces.map((place, index) => (
                        <PlaceCard
                          key={`${place.name}-${index}`}
                          place={place}
                          onSelect={selectNearbyPlace}
                          isActive={
                            selectedPlace?.name === place.name
                          }
                        />
                      ))}
                    </div>

                  )}

                </div>
              )}

            </>
          )}

        </aside>


        {/* ---------- MAP AREA ---------- */}

        <section className="map-area">

          {/* Map toolbar */}

          <div className="map-toolbar">

            <div className="map-location-info">
              <span className="location-dot" />
              <div>
                <h2>{placeName.split(",")[0]}</h2>
                <span className="location-subtitle">
                  {placeName.split(",").slice(1, 3).join(",").trim() ||
                    "Explore the map"}
                </span>
              </div>
            </div>

            <div className="map-controls">
              {/* Map style switcher */}
              <div className="map-style-switcher">
                {MAP_STYLES.map((style) => (
                  <button
                    key={style.key}
                    className={`style-btn ${
                      mapStyle === style.key ? "style-active" : ""
                    }`}
                    onClick={() => setMapStyle(style.key)}
                    title={style.label}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

          </div>


          {/* Weather widget */}
          <WeatherWidget
            weather={weather}
            loading={weatherLoading}
          />


          {/* Map container */}

          <div className="map-container-wrapper">

            <MapContainer
              center={position}
              zoom={12}
              className="explore-map"
              scrollWheelZoom={true}
              zoomControl={false}
            >

              <TileLayer
                attribution={currentMapStyle.attribution}
                url={currentMapStyle.url}
              />

              <MapResize />
              <MapController position={position} />

              {/* Main destination marker */}
              <Marker position={position}>
                <Popup>
                  <strong>{placeName}</strong>
                </Popup>
              </Marker>

              {/* Nearby place markers */}
              {nearbyPlaces.map((place, i) => {
                const lat = Number(place.latitude);
                const lon = Number(place.longitude);

                if (Number.isNaN(lat) || Number.isNaN(lon)) {
                  return null;
                }

                return (
                  <CircleMarker
                    key={`nearby-${i}`}
                    center={[lat, lon]}
                    radius={7}
                    pathOptions={{
                      fillColor:
                        CATEGORY_COLORS[place.category] ||
                        "#6366f1",
                      color: "#ffffff",
                      weight: 2,
                      opacity: 0.9,
                      fillOpacity: 0.85,
                    }}
                    eventHandlers={{
                      click: () => selectNearbyPlace(place),
                    }}
                  >
                    <Tooltip
                      direction="top"
                      offset={[0, -8]}
                      className="place-tooltip"
                    >
                      <span>
                        {place.icon} {place.name}
                      </span>
                    </Tooltip>
                  </CircleMarker>
                );
              })}

            </MapContainer>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Explore;