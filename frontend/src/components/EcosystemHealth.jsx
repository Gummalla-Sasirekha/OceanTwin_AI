import { useEffect, useState } from "react";
import {
  Droplets,
  Fish,
  Trees,
  Factory,
  Waves,
  CheckCircle
} from "lucide-react";

import "./EcosystemHealth.css";

function EcosystemHealth({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchEcosystemHealth = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/ecosystem-health?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve ecosystem health data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchEcosystemHealth();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="ecosystem-health-section">

        <div className="ecosystem-health-message">
          Select a location on the ocean map to view ecosystem health.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="ecosystem-health-section">

        <div className="ecosystem-health-message">
          Loading ecosystem health data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="ecosystem-health-section">

        <div className="ecosystem-health-message ecosystem-health-error">
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


  const healthScore = data.ecosystem_health_score;
  const healthStatus = data.ecosystem_health_status;


  return (
    <section className="ecosystem-health-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="ecosystem-health-header">

        <h2>
          Ecosystem Health Assessment
        </h2>

        <p>
          Composite assessment of environmental conditions for the selected location.
        </p>

        <span className="ecosystem-health-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="ecosystem-health-location">

        <span className="ecosystem-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="ecosystem-divider">
          |
        </span>

        <span className="ecosystem-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          MAIN HEALTH SCORE
      ========================= */}

      <div className="ecosystem-health-score-card">

        <div className="ecosystem-score-circle">

          <span className="ecosystem-score-value">
            {healthScore}
          </span>

          <span className="ecosystem-score-label">
            / 100
          </span>

        </div>

        <div className="ecosystem-score-content">

          <span className="ecosystem-score-title">
            Ecosystem Health Score
          </span>

          <strong className="ecosystem-score-status">
            {healthStatus}
          </strong>

          <span className="ecosystem-score-description">
            Composite prototype indicator
          </span>

        </div>

      </div>


      {/* =========================
          COMPONENT SCORES
      ========================= */}

      <div className="ecosystem-components-grid">

        {/* Water Quality */}

        <div className="ecosystem-component-card">

          <div className="ecosystem-component-icon ecosystem-icon-blue">
            <Droplets size={24} />
          </div>

          <div className="ecosystem-component-content">

            <span className="ecosystem-component-label">
              Water Quality
            </span>

            <strong className="ecosystem-component-value">
              {data.components.water_quality.score}
            </strong>

            <small>
              Weight: 20%
            </small>

          </div>

        </div>


        {/* Biodiversity */}

        <div className="ecosystem-component-card">

          <div className="ecosystem-component-icon ecosystem-icon-green">
            <Fish size={24} />
          </div>

          <div className="ecosystem-component-content">

            <span className="ecosystem-component-label">
              Biodiversity
            </span>

            <strong className="ecosystem-component-value">
              {data.components.biodiversity.score}
            </strong>

            <small>
              Weight: 25%
            </small>

          </div>

        </div>


        {/* Habitat Health */}

        <div className="ecosystem-component-card">

          <div className="ecosystem-component-icon ecosystem-icon-green">
            <Trees size={24} />
          </div>

          <div className="ecosystem-component-content">

            <span className="ecosystem-component-label">
              Habitat Health
            </span>

            <strong className="ecosystem-component-value">
              {data.components.habitat_health.score}
            </strong>

            <small>
              Weight: 25%
            </small>

          </div>

        </div>


        {/* Pollution */}

        <div className="ecosystem-component-card">

          <div className="ecosystem-component-icon ecosystem-icon-orange">
            <Factory size={24} />
          </div>

          <div className="ecosystem-component-content">

            <span className="ecosystem-component-label">
              Pollution
            </span>

            <strong className="ecosystem-component-value">
              {data.components.pollution.score}
            </strong>

            <small>
              Weight: 15%
            </small>

          </div>

        </div>


        {/* Coastal Condition */}

        <div className="ecosystem-component-card">

          <div className="ecosystem-component-icon ecosystem-icon-blue">
            <Waves size={24} />
          </div>

          <div className="ecosystem-component-content">

            <span className="ecosystem-component-label">
              Coastal Condition
            </span>

            <strong className="ecosystem-component-value">
              {data.components.coastal_condition.score}
            </strong>

            <small>
              Weight: 15%
            </small>

          </div>

        </div>

      </div>


      {/* =========================
          OVERALL STATUS
      ========================= */}

      <div className="ecosystem-health-overall">

        <div className="ecosystem-overall-icon">
          <CheckCircle size={25} />
        </div>

        <div className="ecosystem-overall-content">

          <span className="ecosystem-overall-label">
            Overall Ecosystem Health
          </span>

          <strong className="ecosystem-overall-value">
            {healthStatus}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default EcosystemHealth;