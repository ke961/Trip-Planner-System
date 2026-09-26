import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
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
// MAP CONTROLLER
// -----------------------------------------

function MapController({ position }) {
  const map = useMap();

  useEffect(() => {
    if (!position) {
      return;
    }

    map.flyTo(position, 12, {
      duration: 1.2,
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

    window.addEventListener(
      "resize",
      resizeMap
    );

    return () => {
      window.removeEventListener(
        "resize",
        resizeMap
      );
    };
  }, [map]);

  return null;
}


// -----------------------------------------
// EXPLORE PAGE
// -----------------------------------------

function Explore() {
  const [searchParams] = useSearchParams();

  const [city, setCity] = useState("");

  const [position, setPosition] = useState([
    23.8103,
    90.4125,
  ]);

  const [placeName, setPlaceName] = useState(
    "Dhaka, Bangladesh"
  );

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // -----------------------------------------
  // SEARCH DESTINATION
  // -----------------------------------------

  const searchDestination = async (
    searchValue = city
  ) => {
    const destination = searchValue.trim();

    if (!destination) {
      setError(
        "Please enter a destination."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/destinations/search?city=${encodeURIComponent(
          destination
        )}`
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error: ${response.status}`
        );
      }

      const data = await response.json();

      const searchResults =
        Array.isArray(data.results)
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

      const latitude = Number(
        firstPlace.latitude
      );

      const longitude = Number(
        firstPlace.longitude
      );

      if (
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        throw new Error(
          "Invalid coordinates received."
        );
      }

      setPosition([
        latitude,
        longitude,
      ]);

      setPlaceName(
        firstPlace.name ||
          destination
      );
    } catch (err) {
      console.error(
        "Destination search error:",
        err
      );

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
    const latitude = Number(
      place.latitude
    );

    const longitude = Number(
      place.longitude
    );

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      return;
    }

    setPosition([
      latitude,
      longitude,
    ]);

    setPlaceName(
      place.name || "Selected location"
    );
  };


  // -----------------------------------------
  // READ ?city= FROM HOME PAGE
  // -----------------------------------------

  useEffect(() => {
    const cityFromUrl =
      searchParams.get("city");

    if (!cityFromUrl) {
      return;
    }

    setCity(cityFromUrl);

    searchDestination(cityFromUrl);
  }, [searchParams]);


  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <main className="explore-page">

      {/* HEADER */}

      <div className="explore-header">

        <span className="explore-label">
          DISCOVER
        </span>

        <h1>
          Explore Destinations
        </h1>

        <p>
          Search for a destination and explore
          it on the interactive map.
        </p>

      </div>


      {/* SEARCH */}

      <div className="search-section">

        <div className="search-input-wrapper">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Enter a city or destination..."
            value={city}
            onChange={(e) =>
              setCity(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchDestination();
              }
            }}
          />

        </div>

        <button
          onClick={() =>
            searchDestination()
          }
          disabled={loading}
        >
          {loading
            ? "Searching..."
            : "Search"}
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {/* CONTENT */}

      <div className="explore-content">

        {/* RESULTS */}

        <aside className="results-panel">

          <div className="panel-header">

            <div>

              <span className="panel-label">
                DESTINATIONS
              </span>

              <h2>
                Search Results
              </h2>

            </div>

            {results.length > 0 && (
              <span className="result-count">
                {results.length}
              </span>
            )}

          </div>


          {/* EMPTY STATE */}

          {results.length === 0 ? (

            <div className="no-results">

              <div className="no-results-icon">
                🌍
              </div>

              <h3>
                Find a destination
              </h3>

              <p>
                Search for a city or place to
                see available locations.
              </p>

            </div>

          ) : (

            <div className="results-list">

              {results.map(
                (place, index) => (

                  <button
                    key={`${place.name}-${index}`}
                    className="result-card"
                    onClick={() =>
                      selectDestination(place)
                    }
                  >

                    <div className="result-icon">
                      📍
                    </div>

                    <div className="result-info">

                      <h3>
                        {place.name
                          ?.split(",")[0] ||
                          "Unknown location"}
                      </h3>

                      <p>
                        {place.name ||
                          "Unknown location"}
                      </p>

                      <span>
                        {Number(
                          place.latitude
                        ).toFixed(4)}

                        {" , "}

                        {Number(
                          place.longitude
                        ).toFixed(4)}
                      </span>

                    </div>

                  </button>

                )
              )}

            </div>

          )}

        </aside>


        {/* MAP */}

        <section className="map-section">

          <div className="map-header">

            <div>

              <span className="map-label">
                CURRENT LOCATION
              </span>

              <h2>
                📍{" "}
                {placeName.split(",")[0]}
              </h2>

            </div>

          </div>


          <div className="map-wrapper">

            <MapContainer
              center={position}
              zoom={12}
              className="explore-map"
              scrollWheelZoom={true}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapResize />

              <MapController
                position={position}
              />

              <Marker
                position={position}
              >

                <Popup>
                  <strong>
                    {placeName}
                  </strong>
                </Popup>

              </Marker>

            </MapContainer>

          </div>

        </section>

      </div>

    </main>
  );
}

export default Explore;