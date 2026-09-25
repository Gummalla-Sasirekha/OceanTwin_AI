import { useEffect, useState } from "react";
import {
  Waves,
  TrendingUp,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

import "./CoastalChange.css";

function CoastalChange({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchCoastalChange = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/coastal-change?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve coastal change data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchCoastalChange();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="coastal-change-section">

        <div className="coastal-change-message">
          Select a location on the ocean map to view coastal change.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="coastal-change-section">

        <div className="coastal-change-message">
          Loading coastal change data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="coastal-change-section">

        <div className="coastal-change-message coastal-change-error">
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
    <section className="coastal-change-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="coastal-change-header">

        <h2>
          Coastal Change Analysis
        </h2>

        <p>
          Coastal change and condition indicators for the selected location.
        </p>

        <span className="coastal-change-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="coastal-change-location">

        <span className="coastal-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="coastal-divider">
          |
        </span>

        <span className="coastal-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          COASTAL CHANGE INDICATORS
      ========================= */}

      <div className="coastal-change-grid">

        {/* Coastal Change */}

        <div className="coastal-change-card">

          <div className="coastal-change-icon coastal-icon-blue">
            <Waves size={25} />
          </div>

          <div className="coastal-card-content">

            <span className="coastal-card-label">
              Coastal Change
            </span>

            <strong className="coastal-card-value">
              {data.indicators.coastal_change_percent.value}%
            </strong>

            <small>
              change detected
            </small>

          </div>

        </div>


        {/* Change Status */}

        <div className="coastal-change-card">

          <div className="coastal-change-icon coastal-icon-orange">
            <TrendingUp size={25} />
          </div>

          <div className="coastal-card-content">

            <span className="coastal-card-label">
              Change Status
            </span>

            <strong className="coastal-card-value coastal-good">
              {data.coastal_change_status}
            </strong>

          </div>

        </div>


        {/* Coastal Condition */}

        <div className="coastal-change-card">

          <div className="coastal-change-icon coastal-icon-green">
            <ShieldCheck size={25} />
          </div>

          <div className="coastal-card-content">

            <span className="coastal-card-label">
              Coastal Condition
            </span>

            <strong className="coastal-card-value coastal-good">
              {data.coastal_condition}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          OVERALL COASTAL CONDITION
      ========================= */}

      <div className="coastal-overall">

        <div className="coastal-overall-icon">
          <CheckCircle size={25} />
        </div>

        <div className="coastal-overall-content">

          <span className="coastal-overall-label">
            Overall Coastal Condition
          </span>

          <strong className="coastal-overall-value">
            {data.coastal_condition}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default CoastalChange;