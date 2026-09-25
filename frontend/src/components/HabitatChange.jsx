import { useEffect, useState } from "react";
import {
  Trees,
  TrendingDown,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

import "./HabitatChange.css";

function HabitatChange({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchHabitatChange = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/habitat-change?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
        );

        if (!response.ok) {
          throw new Error(
            `Server error: ${response.status}`
          );
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);

      } catch (err) {

        console.error(err);

        setError(
          err.message ||
          "Unable to retrieve habitat change data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchHabitatChange();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="habitat-change-section">

        <div className="habitat-change-message">
          Select a location on the ocean map to view habitat change.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="habitat-change-section">

        <div className="habitat-change-message">
          Loading habitat change data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="habitat-change-section">

        <div className="habitat-change-message habitat-change-error">
          {error}
        </div>

      </section>
    );
  }


  // ==================================================
  // NO DATA
  // ==================================================

  if (!data) {
    return null;
  }


  return (
    <section className="habitat-change-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="habitat-change-header">

        <h2>
          Mangrove & Habitat Change
        </h2>

        <p>
          Habitat condition and change indicators for the selected location.
        </p>

        <span className="habitat-change-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="habitat-change-location">

        <span className="habitat-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="habitat-divider">
          |
        </span>

        <span className="habitat-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          INDICATOR CARDS
      ========================= */}

      <div className="habitat-change-grid">

        {/* Habitat Change */}

        <div className="habitat-change-card">

          <div className="habitat-change-icon habitat-icon-blue">
            <TrendingDown size={25} />
          </div>

          <div className="habitat-card-content">

            <span className="habitat-card-label">
              Habitat Change
            </span>

            <strong className="habitat-card-value">
              {data.indicators.habitat_change_percent.value}%
            </strong>

            <small>
              change detected
            </small>

          </div>

        </div>


        {/* Change Status */}

        <div className="habitat-change-card">

          <div className="habitat-change-icon habitat-icon-green">
            <Trees size={25} />
          </div>

          <div className="habitat-card-content">

            <span className="habitat-card-label">
              Change Status
            </span>

            <strong className="habitat-card-value habitat-good">
              {data.habitat_change_status}
            </strong>

          </div>

        </div>


        {/* Habitat Health */}

        <div className="habitat-change-card">

          <div className="habitat-change-icon habitat-icon-green">
            <ShieldCheck size={25} />
          </div>

          <div className="habitat-card-content">

            <span className="habitat-card-label">
              Habitat Health
            </span>

            <strong className="habitat-card-value habitat-good">
              {data.habitat_health}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          OVERALL HABITAT STATUS
      ========================= */}

      <div className="habitat-overall">

        <div className="habitat-overall-icon">
          <CheckCircle size={25} />
        </div>

        <div className="habitat-overall-content">

          <span className="habitat-overall-label">
            Overall Habitat Condition
          </span>

          <strong className="habitat-overall-value">
            {data.habitat_health}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default HabitatChange;