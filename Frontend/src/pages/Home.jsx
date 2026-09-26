import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const popularDestinations = [
    {
      name: "Tokyo",
      country: "Japan",
      region: "Asia",
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Seoul",
      country: "South Korea",
      region: "Asia",
      image:
        "https://images.unsplash.com/photo-1538485399081-7c8971b0d5e0?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Paris",
      country: "France",
      region: "Europe",
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Dubai",
      country: "United Arab Emirates",
      region: "Middle East",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "New York",
      country: "United States",
      region: "North America",
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1200&q=85",
    },
    {
      name: "Sydney",
      country: "Australia",
      region: "Oceania",
      image:
        "https://images.unsplash.com/photo-1506973035872-a4f6e399b7f8?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  const features = [
    {
      icon: "🌍",
      title: "Worldwide Destinations",
      description:
        "Discover cities and destinations across Asia, Europe, the Americas, Africa, and Oceania.",
    },
    {
      icon: "🗺️",
      title: "Interactive World Map",
      description:
        "Search destinations and explore their locations using an interactive global map.",
    },
    {
      icon: "📅",
      title: "Smart Trip Planning",
      description:
        "Organize your destination, travel dates, travelers, activities, and itinerary.",
    },
    {
      icon: "💰",
      title: "Budget Planning",
      description:
        "Keep your travel expenses organized and plan your trip around your budget.",
    },
    {
      icon: "🌦️",
      title: "Destination Weather",
      description:
        "Check destination weather information to help you prepare for your journey.",
    },
    {
      icon: "💱",
      title: "Currency Support",
      description:
        "Plan international trips with support for different currencies around the world.",
    },
  ];

  const regions = [
    {
      name: "Asia",
      description: "Discover vibrant cities, cultures, beaches, and mountains.",
      image:
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Europe",
      description: "Explore historic cities, architecture, art, and landscapes.",
      image:
        "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Americas",
      description: "Experience iconic cities, nature, and unforgettable adventures.",
      image:
        "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Middle East",
      description: "Discover modern cities, deserts, history, and rich traditions.",
      image:
        "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Africa",
      description: "Explore breathtaking landscapes, wildlife, and diverse cultures.",
      image:
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1000&q=85",
    },
    {
      name: "Oceania",
      description: "Discover islands, beaches, cities, and natural wonders.",
      image:
        "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?auto=format&fit=crop&w=1000&q=85",
    },
  ];

  const searchDestination = (destination) => {
    const value = destination.trim();

    if (!value) {
      navigate("/explore");
      return;
    }

    navigate(`/explore?city=${encodeURIComponent(value)}`);
  };

  const handleSearch = () => {
    searchDestination(search);
  };

  return (
    <main className="home-page">

      {/* =========================
          HERO
      ========================= */}

      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge">
            <span>✦</span>
            EXPLORE THE WORLD
          </div>

          <h1>
            Your world.
            <br />
            <span>Your journey.</span>
          </h1>

          <p className="hero-description">
            Discover amazing destinations, explore new places,
            and create unforgettable travel experiences with
            TripPlanner.
          </p>

          <div className="hero-search">
            <div className="hero-search-icon">
              🔍
            </div>

            <input
              type="text"
              value={search}
              placeholder="Where do you want to go?"
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />

            <button type="button" onClick={handleSearch}>
              Explore
              <span>→</span>
            </button>
          </div>

          <div className="popular-searches">
            <span>Popular:</span>

            <button
              type="button"
              onClick={() => searchDestination("Tokyo")}
            >
              Tokyo
            </button>

            <button
              type="button"
              onClick={() => searchDestination("Seoul")}
            >
              Seoul
            </button>

            <button
              type="button"
              onClick={() => searchDestination("Paris")}
            >
              Paris
            </button>

            <button
              type="button"
              onClick={() => searchDestination("Dubai")}
            >
              Dubai
            </button>

            <button
              type="button"
              onClick={() => searchDestination("New York")}
            >
              New York
            </button>
          </div>
        </div>

        <div className="hero-bottom">
          <span>Start exploring</span>
          <span className="hero-arrow">↓</span>
        </div>
      </section>

      {/* =========================
          POPULAR DESTINATIONS
      ========================= */}

      <section className="destinations-section">
        <div className="home-container">

          <div className="section-heading-row">
            <div>
              <span className="section-label">
                POPULAR DESTINATIONS
              </span>

              <h2>
                Places worth
                <br />
                discovering
              </h2>
            </div>

            <button
              type="button"
              className="text-button"
              onClick={() => navigate("/explore")}
            >
              Explore all destinations
              <span>→</span>
            </button>
          </div>

          <div className="destination-grid">
            {popularDestinations.map((destination) => (
              <button
                type="button"
                className="destination-card"
                key={destination.name}
                onClick={() => searchDestination(destination.name)}
              >
                <img
                  src={destination.image}
                  alt={`${destination.name}, ${destination.country}`}
                />

                <div className="destination-card-overlay">
                  <div>
                    <span className="destination-region">
                      {destination.region}
                    </span>

                    <h3>{destination.name}</h3>

                    <p>
                      <span>📍</span>
                      {destination.country}
                    </p>
                  </div>

                  <span className="destination-card-arrow">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================
          REGIONS
      ========================= */}

      <section className="regions-section">
        <div className="home-container">

          <div className="center-heading">
            <span className="section-label">
              EXPLORE BY REGION
            </span>

            <h2>
              Discover the world,
              <br />
              one region at a time
            </h2>

            <p>
              From bustling cities to peaceful landscapes,
              find destinations that match the journey
              you have in mind.
            </p>
          </div>

          <div className="regions-grid">
            {regions.map((region) => (
              <button
                type="button"
                className="region-card"
                key={region.name}
                onClick={() => searchDestination(region.name)}
              >
                <img
                  src={region.image}
                  alt={region.name}
                />

                <div className="region-overlay">
                  <div>
                    <h3>{region.name}</h3>
                    <p>{region.description}</p>
                  </div>

                  <span>→</span>
                </div>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* =========================
          FEATURES
      ========================= */}

      <section className="features-section">
        <div className="home-container">

          <div className="center-heading">
            <span className="section-label">
              WHY TRIPPLANNER
            </span>

            <h2>
              Everything you need
              <br />
              for your journey
            </h2>

            <p>
              Simple tools to help you discover destinations
              and organize your travel plans in one place.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature) => (
              <div
                className="feature-card"
                key={feature.title}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>

                <h3>{feature.title}</h3>

                <p>{feature.description}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* =========================
          HOW IT WORKS
      ========================= */}

      <section className="how-section">
        <div className="home-container">

          <div className="center-heading">
            <span className="section-label">
              HOW IT WORKS
            </span>

            <h2>
              Plan your next adventure
              <br />
              in three simple steps
            </h2>
          </div>

          <div className="steps-grid">

            <div className="step-card">
              <div className="step-number">
                01
              </div>

              <div className="step-content">
                <h3>Discover</h3>

                <p>
                  Search for a destination and discover
                  places around the world that interest you.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">
                02
              </div>

              <div className="step-content">
                <h3>Plan</h3>

                <p>
                  Choose your dates, travelers, budget,
                  activities, and other trip details.
                </p>
              </div>
            </div>

            <div className="step-card">
              <div className="step-number">
                03
              </div>

              <div className="step-content">
                <h3>Travel</h3>

                <p>
                  Keep your travel plans organized and
                  enjoy your journey with confidence.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* =========================
          STATS
      ========================= */}

      <section className="stats-section">
        <div className="home-container">

          <div className="stats-grid">

            <div className="stat-item">
              <strong>195+</strong>
              <span>Countries</span>
            </div>

            <div className="stat-item">
              <strong>1,000+</strong>
              <span>Destinations</span>
            </div>

            <div className="stat-item">
              <strong>24/7</strong>
              <span>Travel Planning</span>
            </div>

            <div className="stat-item">
              <strong>1</strong>
              <span>Global Platform</span>
            </div>

          </div>

        </div>
      </section>

      {/* =========================
          CTA
      ========================= */}

      <section className="cta-section">
        <div className="cta-background"></div>

        <div className="cta-content">
          <span className="section-label">
            YOUR NEXT ADVENTURE
          </span>

          <h2>
            The world is waiting.
            <br />
            Where will you go?
          </h2>

          <p>
            Start discovering destinations and build
            your next unforgettable journey.
          </p>

          <button
            type="button"
            className="cta-button"
            onClick={() => navigate("/explore")}
          >
            Start Exploring
            <span>→</span>
          </button>
        </div>
      </section>

    </main>
  );
}

export default Home;