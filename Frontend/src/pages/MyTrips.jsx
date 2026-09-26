import { useEffect, useState } from "react";
import "./MyTrips.css";

function MyTrips() {

  const [savedTrips, setSavedTrips] = useState([]);

  const [editingTripId, setEditingTripId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [trip, setTrip] = useState({
    title: "",
    start_location: "",
    destination: "",
    start_date: "",
    end_date: "",
    budget: "",
    travelers: 1
  });


  // Load trips
  const loadTrips = async () => {

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/trips/"
      );

      if (!response.ok) {
        throw new Error("Failed to load trips");
      }

      const data = await response.json();

      setSavedTrips(data);

    } catch (err) {

      setError("Unable to load trips.");

    }
  };


  useEffect(() => {
    loadTrips();
  }, []);


  // Handle input
  const handleTripChange = (e) => {

    const { name, value } = e.target;

    setTrip({
      ...trip,
      [name]: value
    });
  };


  // Create or update
  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    const tripData = {
      ...trip,
      budget: Number(trip.budget),
      travelers: Number(trip.travelers)
    };


    try {

      let response;

      if (editingTripId) {

        response = await fetch(
          `http://127.0.0.1:8000/trips/${editingTripId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(tripData)
          }
        );

      } else {

        response = await fetch(
          "http://127.0.0.1:8000/trips/",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify(tripData)
          }
        );

      }


      if (!response.ok) {
        throw new Error("Request failed");
      }


      await loadTrips();

      resetForm();

    } catch (err) {

      setError(
        editingTripId
          ? "Unable to update trip."
          : "Unable to create trip."
      );

    } finally {

      setLoading(false);

    }
  };


  // Edit
  const startEditing = (selectedTrip) => {

    setEditingTripId(selectedTrip.id);

    setTrip({
      title: selectedTrip.title,
      start_location: selectedTrip.start_location,
      destination: selectedTrip.destination,
      start_date: selectedTrip.start_date,
      end_date: selectedTrip.end_date,
      budget: selectedTrip.budget,
      travelers: selectedTrip.travelers
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // Delete
  const deleteTrip = async (tripId) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `http://127.0.0.1:8000/trips/${tripId}`,
        {
          method: "DELETE"
        }
      );


      if (!response.ok) {
        throw new Error("Delete failed");
      }


      await loadTrips();

    } catch (err) {

      setError("Unable to delete trip.");

    }
  };


  // Reset form
  const resetForm = () => {

    setTrip({
      title: "",
      start_location: "",
      destination: "",
      start_date: "",
      end_date: "",
      budget: "",
      travelers: 1
    });

    setEditingTripId(null);

  };


  return (

    <div className="my-trips-page">

      <div className="trips-container">


        {/* Page Header */}

        <div className="trips-header">

          <h1>My Trips</h1>

          <p>
            Create and manage your travel plans.
          </p>

        </div>


        {/* Error */}

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}


        {/* Trip Form */}

        <section className="trip-form-section">

          <div className="section-heading">

            <h2>
              {editingTripId
                ? "Edit Trip"
                : "Create a New Trip"}
            </h2>

            <p>
              {editingTripId
                ? "Update your trip information."
                : "Add your travel details below."}
            </p>

          </div>


          <form
            className="trip-form"
            onSubmit={handleSubmit}
          >


            <div className="form-group">

              <label>
                Trip Title
              </label>

              <input
                type="text"
                name="title"
                placeholder="Example: Cox's Bazar Trip"
                value={trip.title}
                onChange={handleTripChange}
                required
              />

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Starting Location
                </label>

                <input
                  type="text"
                  name="start_location"
                  placeholder="Example: Dhaka"
                  value={trip.start_location}
                  onChange={handleTripChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Destination
                </label>

                <input
                  type="text"
                  name="destination"
                  placeholder="Example: Cox's Bazar"
                  value={trip.destination}
                  onChange={handleTripChange}
                  required
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Start Date
                </label>

                <input
                  type="date"
                  name="start_date"
                  value={trip.start_date}
                  onChange={handleTripChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  End Date
                </label>

                <input
                  type="date"
                  name="end_date"
                  value={trip.end_date}
                  onChange={handleTripChange}
                  required
                />

              </div>

            </div>


            <div className="form-row">

              <div className="form-group">

                <label>
                  Budget
                </label>

                <input
                  type="number"
                  name="budget"
                  placeholder="Example: 25000"
                  min="0"
                  value={trip.budget}
                  onChange={handleTripChange}
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  Travelers
                </label>

                <input
                  type="number"
                  name="travelers"
                  min="1"
                  value={trip.travelers}
                  onChange={handleTripChange}
                  required
                />

              </div>

            </div>


            <div className="form-buttons">

              <button
                type="submit"
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingTripId
                    ? "Update Trip"
                    : "Create Trip"}
              </button>


              {editingTripId && (

                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        {/* Saved Trips */}

        <section className="saved-trips-section">

          <div className="section-heading">

            <h2>
              Saved Trips
            </h2>

            <p>
              {savedTrips.length} trip
              {savedTrips.length !== 1 ? "s" : ""} saved
            </p>

          </div>


          {savedTrips.length === 0 ? (

            <div className="empty-trips">

              <div className="empty-icon">
                ✈️
              </div>

              <h3>
                No trips yet
              </h3>

              <p>
                Create your first trip using the form above.
              </p>

            </div>

          ) : (

            <div className="trips-grid">

              {savedTrips.map((savedTrip) => (

                <div
                  className="trip-card"
                  key={savedTrip.id}
                >

                  <div className="trip-card-top">

                    <div>

                      <h3>
                        {savedTrip.title}
                      </h3>

                      <p className="trip-route">
                        📍 {savedTrip.start_location}
                        {" → "}
                        {savedTrip.destination}
                      </p>

                    </div>

                    <span className="trip-id">
                      #{savedTrip.id}
                    </span>

                  </div>


                  <div className="trip-details">

                    <div className="detail-item">

                      <span className="detail-label">
                        📅 Dates
                      </span>

                      <span>
                        {savedTrip.start_date}
                        {" → "}
                        {savedTrip.end_date}
                      </span>

                    </div>


                    <div className="detail-item">

                      <span className="detail-label">
                        💰 Budget
                      </span>

                      <span>
                        ৳ {Number(savedTrip.budget).toLocaleString()}
                      </span>

                    </div>


                    <div className="detail-item">

                      <span className="detail-label">
                        👥 Travelers
                      </span>

                      <span>
                        {savedTrip.travelers}
                      </span>

                    </div>

                  </div>


                  <div className="trip-actions">

                    <button
                      className="edit-button"
                      onClick={() =>
                        startEditing(savedTrip)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-button"
                      onClick={() =>
                        deleteTrip(savedTrip.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </div>

    </div>

  );
}

export default MyTrips;