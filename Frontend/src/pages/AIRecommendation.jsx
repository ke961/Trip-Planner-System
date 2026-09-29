import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AIRecommendation.css";

function AIRecommendation() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState("");
  const [travelType, setTravelType] = useState("Solo");
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [interests, setInterests] = useState([]);

  const [recommendation, setRecommendation] = useState(null);
  const [saveStatus, setSaveStatus] = useState("");

  const interestOptions = [
    "🏖️ Beaches",
    "🌿 Nature",
    "🏛️ History",
    "🍜 Food",
    "🛍️ Shopping",
    "🏔️ Adventure",
    "📸 Photography",
    "🎨 Culture",
    "🌃 Nightlife",
    "☕ Relaxation",
  ];

  const destinationData = {
    "Tokyo, Japan": {
      image:
        "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1400&q=80",
      description:
        "A vibrant blend of traditional culture, modern technology, incredible food and unforgettable city experiences.",
      activities: [
        "Shibuya Crossing",
        "Senso-ji Temple",
        "Tokyo Skytree",
        "Meiji Shrine",
        "teamLab Borderless",
        "Tsukiji Outer Market",
      ],
    },

    "Seoul, South Korea": {
      image:
        "https://images.unsplash.com/photo-1538485399081-7c8973f7a5b1?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience Korean culture, modern city life, delicious food, shopping and beautiful historic neighborhoods.",
      activities: [
        "Gyeongbokgung Palace",
        "Bukchon Hanok Village",
        "Myeongdong",
        "N Seoul Tower",
        "Hongdae",
        "Han River",
      ],
    },

    "Paris, France": {
      image:
        "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
      description:
        "Discover iconic architecture, art, history, cafés and romantic streets in the heart of France.",
      activities: [
        "Eiffel Tower",
        "Louvre Museum",
        "Arc de Triomphe",
        "Montmartre",
        "Seine River",
        "Champs-Élysées",
      ],
    },

    "Dubai, UAE": {
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1400&q=80",
      description:
        "A futuristic destination known for luxury, architecture, shopping, desert adventures and entertainment.",
      activities: [
        "Burj Khalifa",
        "Dubai Mall",
        "Dubai Marina",
        "Palm Jumeirah",
        "Desert Safari",
        "Dubai Frame",
      ],
    },

    "London, United Kingdom": {
      image:
        "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80",
      description:
        "Explore historic landmarks, museums, royal attractions, diverse food and iconic London neighborhoods.",
      activities: [
        "Big Ben",
        "Tower Bridge",
        "Buckingham Palace",
        "British Museum",
        "London Eye",
        "Hyde Park",
      ],
    },

    "New York, USA": {
      image:
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?auto=format&fit=crop&w=1400&q=80",
      description:
        "Experience the energy of one of the world's most famous cities with iconic landmarks, food and entertainment.",
      activities: [
        "Times Square",
        "Central Park",
        "Statue of Liberty",
        "Brooklyn Bridge",
        "Empire State Building",
        "Fifth Avenue",
      ],
    },

    "Sydney, Australia": {
      image:
        "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1400&q=80",
      description:
        "Enjoy beautiful beaches, coastal views, iconic architecture and Australia's vibrant outdoor lifestyle.",
      activities: [
        "Sydney Opera House",
        "Bondi Beach",
        "Sydney Harbour Bridge",
        "Royal Botanic Garden",
        "Manly Beach",
        "Darling Harbour",
      ],
    },

    "Rome, Italy": {
      image:
        "https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&w=1400&q=80",
      description:
        "Walk through thousands of years of history while enjoying Italian cuisine, art and architecture.",
      activities: [
        "Colosseum",
        "Trevi Fountain",
        "Pantheon",
        "Roman Forum",
        "Vatican City",
        "Piazza Navona",
      ],
    },
  };

  const toggleInterest = (interest) => {
    setInterests((previous) =>
      previous.includes(interest)
        ? previous.filter((item) => item !== interest)
        : [...previous, interest]
    );
  };

  const createRecommendation = () => {
    if (!destination.trim()) {
      alert("Please enter a destination.");
      return;
    }

    if (!budget || Number(budget) <= 0) {
      alert("Please enter your travel budget.");
      return;
    }

    const matchedDestination =
      Object.keys(destinationData).find(
        (item) => item.toLowerCase() === destination.trim().toLowerCase()
      ) || null;

    const data = matchedDestination
      ? destinationData[matchedDestination]
      : {
          image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80",
          description:
            "Explore an exciting destination filled with memorable experiences, local culture, food and beautiful places.",
          activities: [
            "Explore the city center",
            "Visit a famous local landmark",
            "Try local cuisine",
            "Visit a cultural attraction",
            "Explore a local market",
            "Enjoy a relaxing evening",
          ],
        };

    const selectedActivities = [...data.activities];

    if (interests.length > 0) {
      if (interests.some((item) => item.includes("Food"))) {
        selectedActivities[2] = "🍜 Discover local food and restaurants";
      }

      if (interests.some((item) => item.includes("Photography"))) {
        selectedActivities[3] = "📸 Explore the best photography spots";
      }

      if (interests.some((item) => item.includes("Shopping"))) {
        selectedActivities[4] = "🛍️ Explore local shopping areas";
      }

      if (interests.some((item) => item.includes("Nature"))) {
        selectedActivities[5] = "🌿 Visit a beautiful natural attraction";
      }
    }

    const totalBudget = Number(budget);
    const hotel = Math.round(totalBudget * 0.35);
    const food = Math.round(totalBudget * 0.2);
    const transport = Math.round(totalBudget * 0.2);
    const activitiesCost = Math.round(totalBudget * 0.15);
    const other = totalBudget - hotel - food - transport - activitiesCost;

    const itinerary = [];

    for (let day = 1; day <= Number(days); day++) {
      const firstActivity =
        selectedActivities[(day - 1) % selectedActivities.length];

      const secondActivity =
        selectedActivities[day % selectedActivities.length];

      const thirdActivity =
        selectedActivities[(day + 1) % selectedActivities.length];

      itinerary.push({
        day,
        activities: [firstActivity, secondActivity, thirdActivity],
      });
    }

    setRecommendation({
      destination: matchedDestination || destination.trim(),
      image: data.image,
      description: data.description,
      itinerary,
      budget: {
        hotel,
        food,
        transport,
        activities: activitiesCost,
        other,
        total: totalBudget,
      },
    });

    setTimeout(() => {
      document
        .getElementById("recommendation-result")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const saveToMyTrips = async () => {
    if (!recommendation) return;
    setSaveStatus("Saving...");
    try {
      const travelersCount =
        travelType === "Family" ? 4 : travelType === "Couple" ? 2 : travelType === "Friends" ? 3 : 1;
      const startDate = new Date().toISOString().split("T")[0];
      const endDate = new Date(Date.now() + Number(days) * 86400000).toISOString().split("T")[0];

      const res = await fetch("http://127.0.0.1:8000/trips/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: `${recommendation.destination} AI Trip`,
          start_location: "Dhaka",
          destination: recommendation.destination,
          start_date: startDate,
          end_date: endDate,
          budget: Number(recommendation.budget.total),
          travelers: travelersCount,
        }),
      });

      if (!res.ok) throw new Error("Failed to save trip");
      setSaveStatus("Saved to My Trips!");
      setTimeout(() => {
        navigate("/my-trips");
      }, 1000);
    } catch (err) {
      console.error("Save to My Trips error:", err);
      setSaveStatus("Failed to save");
      setTimeout(() => setSaveStatus(""), 2500);
    }
  };

  return (
    <div className="ai-page">
      {/* HERO */}
      <section className="ai-hero">
        <div className="ai-hero-overlay">
          <div className="ai-hero-content">
            <span className="ai-badge">✨ SMART TRAVEL PLANNER</span>

            <h1>
              Plan Your Perfect
              <span> Journey With AI</span>
            </h1>

            <p>
              Tell us where you want to go, your budget, interests and travel
              style. We'll create a personalized travel plan for you.
            </p>
          </div>
        </div>
      </section>

      {/* FORM */}
      <section className="planner-section">
        <div className="planner-container">
          <div className="planner-heading">
            <span>🤖 AI TRIP RECOMMENDATION</span>
            <h2>Create Your Personalized Trip</h2>
            <p>
              Customize your preferences and get a smart travel itinerary.
            </p>
          </div>

          <div className="planner-card">
            {/* DESTINATION */}
            <div className="form-group full-width">
              <label>🌍 Where do you want to go?</label>

              <input
                type="text"
                placeholder="e.g. Tokyo, Japan"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                list="destination-list"
              />

              <datalist id="destination-list">
                <option value="Tokyo, Japan" />
                <option value="Seoul, South Korea" />
                <option value="Paris, France" />
                <option value="Dubai, UAE" />
                <option value="London, United Kingdom" />
                <option value="New York, USA" />
                <option value="Sydney, Australia" />
                <option value="Rome, Italy" />
              </datalist>

              <small>
                You can enter any city or destination around the world.
              </small>
            </div>

            {/* DAYS */}
            <div className="form-group">
              <label>📅 How many days?</label>

              <input
                type="number"
                min="1"
                max="30"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </div>

            {/* BUDGET */}
            <div className="form-group">
              <label>💰 Your Budget</label>

              <input
                type="number"
                min="1"
                placeholder="e.g. 1500"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />

              <small>Enter your approximate budget.</small>
            </div>

            {/* TRAVEL TYPE */}
            <div className="form-group">
              <label>👥 Traveling With</label>

              <select
                value={travelType}
                onChange={(e) => setTravelType(e.target.value)}
              >
                <option>Solo</option>
                <option>Couple</option>
                <option>Family</option>
                <option>Friends</option>
              </select>
            </div>

            {/* TRAVEL STYLE */}
            <div className="form-group">
              <label>🎯 Travel Style</label>

              <select
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option>Budget Friendly</option>
                <option>Balanced</option>
                <option>Luxury</option>
                <option>Adventure</option>
                <option>Relaxed</option>
              </select>
            </div>

            {/* INTERESTS */}
            <div className="form-group full-width">
              <label>❤️ What are you interested in?</label>

              <div className="interest-grid">
                {interestOptions.map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    className={`interest-button ${
                      interests.includes(interest) ? "selected" : ""
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* GENERATE */}
            <div className="generate-container full-width">
              <button
                className="generate-button"
                onClick={createRecommendation}
              >
                ✨ Generate My Trip
              </button>

              <p>
                Our smart recommendation engine will create your personalized
                itinerary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RESULT */}
      {recommendation && (
        <section className="result-section" id="recommendation-result">
          <div className="result-container">
            <div className="result-header">
              <span>✨ YOUR PERSONALIZED PLAN</span>

              <h2>
                Your Trip to{" "}
                <strong>{recommendation.destination}</strong>
              </h2>

              <p>{recommendation.description}</p>
            </div>

            {/* DESTINATION CARD */}
            <div className="destination-result-card">
              <div
                className="destination-image"
                style={{
                  backgroundImage: `url(${recommendation.image})`,
                }}
              />

              <div className="destination-info">
                <span className="recommendation-label">
                  ✨ AI RECOMMENDED
                </span>

                <h3>{recommendation.destination}</h3>

                <div className="trip-summary">
                  <div>
                    <strong>📅</strong>
                    <span>{days} Days</span>
                  </div>

                  <div>
                    <strong>👥</strong>
                    <span>{travelType}</span>
                  </div>

                  <div>
                    <strong>🎯</strong>
                    <span>{travelStyle}</span>
                  </div>
                </div>

                {interests.length > 0 && (
                  <div className="selected-interests">
                    <strong>Your Interests:</strong>

                    <div>
                      {interests.map((interest) => (
                        <span key={interest}>{interest}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ITINERARY */}
            <div className="result-grid">
              <div className="itinerary-card">
                <div className="section-title">
                  <span>📅</span>
                  <div>
                    <h3>Day-by-Day Itinerary</h3>
                    <p>Your personalized travel schedule</p>
                  </div>
                </div>

                <div className="timeline">
                  {recommendation.itinerary.map((day) => (
                    <div className="timeline-item" key={day.day}>
                      <div className="timeline-number">{day.day}</div>

                      <div className="timeline-content">
                        <h4>Day {day.day}</h4>

                        {day.activities.map((activity, index) => (
                          <div className="activity" key={index}>
                            <span className="activity-dot" />
                            <span>{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BUDGET */}
              <div className="budget-card">
                <div className="section-title">
                  <span>💰</span>
                  <div>
                    <h3>Estimated Budget</h3>
                    <p>Based on your total budget</p>
                  </div>
                </div>

                <div className="budget-list">
                  <div>
                    <span>🏨 Accommodation</span>
                    <strong>{recommendation.budget.hotel}</strong>
                  </div>

                  <div>
                    <span>🍜 Food</span>
                    <strong>{recommendation.budget.food}</strong>
                  </div>

                  <div>
                    <span>🚕 Transportation</span>
                    <strong>{recommendation.budget.transport}</strong>
                  </div>

                  <div>
                    <span>🎟️ Activities</span>
                    <strong>{recommendation.budget.activities}</strong>
                  </div>

                  <div>
                    <span>📦 Other</span>
                    <strong>{recommendation.budget.other}</strong>
                  </div>
                </div>

                <div className="budget-total">
                  <span>Total Estimated</span>
                  <strong>{recommendation.budget.total}</strong>
                </div>

                <button
                  className="route-button"
                  onClick={() => navigate("/explore")}
                >
                  🗺️ View Destination Map
                </button>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="result-actions">
              <button
                className="secondary-action"
                onClick={() => window.print()}
              >
                🖨️ Print Itinerary
              </button>

              <button
                className="secondary-action"
                onClick={saveToMyTrips}
                disabled={saveStatus.includes("Saving")}
              >
                {saveStatus || "💾 Save to My Trips"}
              </button>

              <button
                className="primary-action"
                onClick={() => {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  });
                }}
              >
                ✨ Create Another Trip
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default AIRecommendation;