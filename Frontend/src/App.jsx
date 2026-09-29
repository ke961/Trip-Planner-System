import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import MyTrips from "./pages/MyTrips";
import AIRecommendation from "./pages/AIRecommendation";


function App() {

  return (
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/my-trips"
          element={<MyTrips />}
        />

        <Route
          path="/plan-trip"
          element={<AIRecommendation />}
        />

        <Route
          path="/ai-recommendation"
          element={<AIRecommendation />}
        />

      </Routes>

      <Footer />

    </BrowserRouter>
  );
}

export default App;