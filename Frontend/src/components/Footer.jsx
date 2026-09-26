import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {

  return (

    <footer className="footer">

      <div className="footer-container">


        {/* Main footer */}

        <div className="footer-main">


          {/* Brand */}

          <div className="footer-brand">

            <Link
              to="/"
              className="footer-logo"
            >

              <span className="footer-logo-icon">
                ✈
              </span>

              <span>
                Trip<span>Planner</span>
              </span>

            </Link>


            <p>
              Plan your journey, discover new
              destinations, and make every trip
              memorable.
            </p>


            <div className="social-links">

              <a
                href="#"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="#"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="#"
                aria-label="Twitter"
              >
                𝕏
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
              >
                in
              </a>

            </div>

          </div>


          {/* Navigation */}

          <div className="footer-column">

            <h3>
              Explore
            </h3>

            <Link to="/">
              Home
            </Link>

            <Link to="/explore">
              Destinations
            </Link>

            <Link to="/my-trips">
              My Trips
            </Link>

          </div>


          {/* Resources */}

          <div className="footer-column">

            <h3>
              Planning
            </h3>

            <Link to="/explore">
              Explore Map
            </Link>

            <Link to="/my-trips">
              Create Trip
            </Link>

            <Link to="/my-trips">
              Manage Trips
            </Link>

          </div>


          {/* Contact */}

          <div className="footer-column">

            <h3>
              Contact
            </h3>

            <a href="mailto:hello@tripplanner.com">
              hello@tripplanner.com
            </a>

            <span>
              Dhaka, Bangladesh
            </span>

          </div>

        </div>


        {/* Bottom */}

        <div className="footer-bottom">

          <p>
            © 2026 TripPlanner. All rights reserved.
          </p>

          <div>

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms
            </a>

          </div>

        </div>

      </div>

    </footer>

  );
}

export default Footer;