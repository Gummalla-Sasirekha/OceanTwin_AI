import { useEffect, useState } from "react";
import {
  Factory,
  AlertTriangle,
  Activity,
  CheckCircle
} from "lucide-react";

import "./Pollution.css";

function Pollution({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchPollution = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/pollution?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        setData(result);

      } catch (err) {

        console.error(err);

        setError(
          err.message || "Unable to retrieve pollution data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchPollution();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="pollution-section">

        <div className="pollution-message">
          Select a location on the ocean map to view pollution risk.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="pollution-section">

        <div className="pollution-message">
          Loading pollution data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="pollution-section">

        <div className="pollution-message pollution-error">
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


  // ==================================================
  // MAIN COMPONENT
  // ==================================================

  return (
    <section className="pollution-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="pollution-header">

        <h2>
          Pollution Monitoring & Risk
        </h2>

        <p>
          Pollution indicators for the selected ocean location.
        </p>

        <span className="pollution-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION & DATE
      ========================= */}

      <div className="pollution-location">

        <span className="pollution-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="pollution-divider">
          |
        </span>

        <span className="pollution-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          POLLUTION INDICATORS
      ========================= */}

      <div className="pollution-grid">

        {/* Pollution Index */}

        <div className="pollution-card">

          <div className="pollution-icon pollution-icon-blue">
            <Activity size={25} />
          </div>

          <div className="pollution-card-content">

            <span className="pollution-label">
              Pollution Index
            </span>

            <strong className="pollution-value">
              {data.indicators.pollution_index.value}
            </strong>

            <small>
              index
            </small>

          </div>

        </div>


        {/* Pollution Status */}

        <div className="pollution-card">

          <div className="pollution-icon pollution-icon-green">
            <Factory size={25} />
          </div>

          <div className="pollution-card-content">

            <span className="pollution-label">
              Pollution Status
            </span>

            <strong className="pollution-value pollution-good">
              {data.pollution_status}
            </strong>

          </div>

        </div>


        {/* Pollution Risk */}

        <div className="pollution-card">

          <div className="pollution-icon pollution-icon-orange">
            <AlertTriangle size={25} />
          </div>

          <div className="pollution-card-content">

            <span className="pollution-label">
              Pollution Risk
            </span>

            <strong className="pollution-value">
              {data.pollution_risk}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          OVERALL POLLUTION RISK
      ========================= */}

      <div className="pollution-overall">

        <div className="pollution-overall-icon">
          <CheckCircle size={25} />
        </div>

        <div className="pollution-overall-content">

          <span className="pollution-overall-label">
            Overall Pollution Risk
          </span>

          <strong className="pollution-overall-value">
            {data.pollution_risk}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default Pollution;