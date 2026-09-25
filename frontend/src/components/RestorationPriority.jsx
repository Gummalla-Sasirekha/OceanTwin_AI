import { useEffect, useState } from "react";
import {
  Trees,
  Factory,
  Fish,
  Waves,
  Target,
  CheckCircle
} from "lucide-react";

import "./RestorationPriority.css";

function RestorationPriority({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchRestorationPriority = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/restoration-priority?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve restoration priority data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchRestorationPriority();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="restoration-priority-section">

        <div className="restoration-priority-message">
          Select a location on the ocean map to view restoration priorities.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="restoration-priority-section">

        <div className="restoration-priority-message">
          Loading restoration priority data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="restoration-priority-section">

        <div className="restoration-priority-message restoration-priority-error">
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
    <section className="restoration-priority-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="restoration-priority-header">

        <h2>
          Restoration Priority & Decision Support
        </h2>

        <p>
          Priority indicators for ecosystem restoration planning.
        </p>

        <span className="restoration-priority-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="restoration-priority-location">

        <span className="restoration-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="restoration-divider">
          |
        </span>

        <span className="restoration-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          OVERALL PRIORITY
      ========================= */}

      <div className="restoration-overall-card">

        <div className="restoration-overall-icon">
          <Target size={30} />
        </div>

        <div className="restoration-overall-content">

          <span className="restoration-overall-label">
            Overall Restoration Priority
          </span>

          <strong className="restoration-overall-value">
            {data.restoration_priority}
          </strong>

          <small>
            Prototype decision-support indicator
          </small>

        </div>

      </div>


      {/* =========================
          PRIORITY INDICATORS
      ========================= */}

      <div className="restoration-priority-grid">

        {/* Habitat Priority */}

        <div className="restoration-priority-card">

          <div className="restoration-priority-icon restoration-icon-green">
            <Trees size={24} />
          </div>

          <div className="restoration-card-content">

            <span className="restoration-card-label">
              Habitat Priority
            </span>

            <strong className="restoration-card-value">
              {data.habitat_priority}
            </strong>

          </div>

        </div>


        {/* Pollution Priority */}

        <div className="restoration-priority-card">

          <div className="restoration-priority-icon restoration-icon-orange">
            <Factory size={24} />
          </div>

          <div className="restoration-card-content">

            <span className="restoration-card-label">
              Pollution Priority
            </span>

            <strong className="restoration-card-value">
              {data.pollution_priority}
            </strong>

          </div>

        </div>


        {/* Biodiversity Priority */}

        <div className="restoration-priority-card">

          <div className="restoration-priority-icon restoration-icon-blue">
            <Fish size={24} />
          </div>

          <div className="restoration-card-content">

            <span className="restoration-card-label">
              Biodiversity Priority
            </span>

            <strong className="restoration-card-value">
              {data.biodiversity_priority}
            </strong>

          </div>

        </div>


        {/* Coastal Priority */}

        <div className="restoration-priority-card">

          <div className="restoration-priority-icon restoration-icon-blue">
            <Waves size={24} />
          </div>

          <div className="restoration-card-content">

            <span className="restoration-card-label">
              Coastal Priority
            </span>

            <strong className="restoration-card-value">
              {data.coastal_priority}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          DECISION SUPPORT STATUS
      ========================= */}

      <div className="restoration-status">

        <div className="restoration-status-icon">
          <CheckCircle size={25} />
        </div>

        <div className="restoration-status-content">

          <span className="restoration-status-label">
            Recommended Restoration Priority
          </span>

          <strong className="restoration-status-value">
            {data.restoration_priority}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default RestorationPriority;