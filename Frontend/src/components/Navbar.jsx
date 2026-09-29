import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">

      <div className="navbar-container">

        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">✈</span>
          <span>TripPlanner</span>
        </Link>


        {/* Navigation */}
        <nav className="navbar-links">

          <Link to="/" className="nav-link">
            Home
          </Link>

          <Link to="/explore" className="nav-link">
            Explore
          </Link>

          <Link to="/my-trips" className="nav-link">
            My Trips
          </Link>

        </nav>


        {/* CTA - Plan a Trip with AI Recommendation */}
        <Link to="/ai-recommendation" className="plan-trip-button">
          <span className="plan-trip-sparkle">✨</span>
          <span>Plan a Trip</span>
          <span className="plan-trip-ai-tag">AI</span>
        </Link>





      </div>

    </header>
  );
}

export default Navbar;