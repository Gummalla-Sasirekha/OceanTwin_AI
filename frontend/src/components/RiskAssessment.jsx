import { useEffect, useState } from "react";
import {
  AlertTriangle,
  Factory,
  Trees,
  Waves,
  Fish,
  ShieldCheck,
  CheckCircle
} from "lucide-react";

import "./RiskAssessment.css";

function RiskAssessment({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchRiskAssessment = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/risk-assessment?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve risk assessment data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchRiskAssessment();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="risk-assessment-section">

        <div className="risk-assessment-message">
          Select a location on the ocean map to view ecosystem risks.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="risk-assessment-section">

        <div className="risk-assessment-message">
          Loading risk assessment...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="risk-assessment-section">

        <div className="risk-assessment-message risk-assessment-error">
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
    <section className="risk-assessment-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="risk-assessment-header">

        <h2>
          AI Ecosystem Risk Assessment
        </h2>

        <p>
          Risk indicators for environmental conditions at the selected location.
        </p>

        <span className="risk-assessment-badge">
          Prototype Data
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="risk-assessment-location">

        <span className="risk-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="risk-divider">
          |
        </span>

        <span className="risk-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          OVERALL RISK
      ========================= */}

      <div className="risk-overall-card">

        <div className="risk-overall-icon">
          <ShieldCheck size={30} />
        </div>

        <div className="risk-overall-content">

          <span className="risk-overall-label">
            Overall Ecosystem Risk
          </span>

          <strong className="risk-overall-value">
            {data.overall_risk}
          </strong>

          <small>
            Composite prototype risk indicator
          </small>

        </div>

      </div>


      {/* =========================
          RISK INDICATORS
      ========================= */}

      <div className="risk-grid">

        {/* Environmental Risk */}

        <div className="risk-card">

          <div className="risk-icon risk-icon-blue">
            <AlertTriangle size={24} />
          </div>

          <div className="risk-card-content">

            <span className="risk-label">
              Environmental Risk
            </span>

            <strong className="risk-value">
              {data.environmental_risk}
            </strong>

          </div>

        </div>


        {/* Pollution Risk */}

        <div className="risk-card">

          <div className="risk-icon risk-icon-orange">
            <Factory size={24} />
          </div>

          <div className="risk-card-content">

            <span className="risk-label">
              Pollution Risk
            </span>

            <strong className="risk-value">
              {data.pollution_risk}
            </strong>

          </div>

        </div>


        {/* Habitat Risk */}

        <div className="risk-card">

          <div className="risk-icon risk-icon-green">
            <Trees size={24} />
          </div>

          <div className="risk-card-content">

            <span className="risk-label">
              Habitat Risk
            </span>

            <strong className="risk-value">
              {data.habitat_risk}
            </strong>

          </div>

        </div>


        {/* Coastal Risk */}

        <div className="risk-card">

          <div className="risk-icon risk-icon-blue">
            <Waves size={24} />
          </div>

          <div className="risk-card-content">

            <span className="risk-label">
              Coastal Risk
            </span>

            <strong className="risk-value">
              {data.coastal_risk}
            </strong>

          </div>

        </div>


        {/* Biodiversity Risk */}

        <div className="risk-card">

          <div className="risk-icon risk-icon-green">
            <Fish size={24} />
          </div>

          <div className="risk-card-content">

            <span className="risk-label">
              Biodiversity Risk
            </span>

            <strong className="risk-value">
              {data.biodiversity_risk}
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          STATUS
      ========================= */}

      <div className="risk-status">

        <div className="risk-status-icon">
          <CheckCircle size={25} />
        </div>

        <div className="risk-status-content">

          <span className="risk-status-label">
            Current Overall Risk
          </span>

          <strong className="risk-status-value">
            {data.overall_risk}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default RiskAssessment;