import { useEffect, useState } from "react";
import {
  Droplets,
  Fish,
  Factory,
  Trees,
  Waves,
  Activity,
  AlertTriangle,
  Target,
  CheckCircle
} from "lucide-react";

import "./DigitalTwinSummary.css";

function DigitalTwinSummary({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchDigitalTwinSummary = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/digital-twin-summary?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve Digital Twin summary."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchDigitalTwinSummary();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="digital-twin-section">

        <div className="digital-twin-message">
          Select a location on the ocean map to view the Digital Twin summary.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="digital-twin-section">

        <div className="digital-twin-message">
          Loading Digital Twin summary...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="digital-twin-section">

        <div className="digital-twin-message digital-twin-error">
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


  const layers = data.layers;


  return (
    <section className="digital-twin-section">

      {/* =========================
          HEADER
      ========================= */}

      <div className="digital-twin-header">

        <h2>
          OceanTwin-AI Digital Twin
        </h2>

        <p>
          Unified ecosystem intelligence for the selected ocean location.
        </p>

        <span className="digital-twin-badge">
          {data.digital_twin_status}
        </span>

      </div>


      {/* =========================
          LOCATION / DATE
      ========================= */}

      <div className="digital-twin-location">

        <span className="digital-location-item">
          📍 Location:
          <strong>
            {Number(selectedLocation.latitude).toFixed(3)}°N,{" "}
            {Number(selectedLocation.longitude).toFixed(3)}°E
          </strong>
        </span>

        <span className="digital-divider">
          |
        </span>

        <span className="digital-location-item">
          📅 Date:
          <strong>
            {data.date}
          </strong>
        </span>

      </div>


      {/* =========================
          DIGITAL TWIN STATUS
      ========================= */}

      <div className="digital-twin-status-card">

        <div className="digital-twin-status-icon">
          <Activity size={30} />
        </div>

        <div className="digital-twin-status-content">

          <span className="digital-twin-status-label">
            Digital Twin Status
          </span>

          <strong className="digital-twin-status-value">
            {data.digital_twin_status}
          </strong>

          <small>
            Unified ecosystem monitoring layer
          </small>

        </div>

      </div>


      {/* =========================
          DIGITAL TWIN LAYERS
      ========================= */}

      <div className="digital-twin-grid">

        {/* Water Quality */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-blue">
            <Droplets size={24} />
          </div>

          <span className="digital-twin-label">
            Water Quality
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.water_quality.status}
          </strong>

          <small>
            Score: {layers.water_quality.score}
          </small>

        </div>


        {/* Biodiversity */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-green">
            <Fish size={24} />
          </div>

          <span className="digital-twin-label">
            Biodiversity
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.biodiversity.status}
          </strong>

          <small>
            Score: {layers.biodiversity.score}
          </small>

        </div>


        {/* Pollution */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-orange">
            <Factory size={24} />
          </div>

          <span className="digital-twin-label">
            Pollution
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.pollution.status}
          </strong>

          <small>
            Risk: {layers.pollution.risk}
          </small>

        </div>


        {/* Habitat */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-green">
            <Trees size={24} />
          </div>

          <span className="digital-twin-label">
            Habitat
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.habitat.status}
          </strong>

          <small>
            Change: {layers.habitat.change}%
          </small>

        </div>


        {/* Coastal */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-blue">
            <Waves size={24} />
          </div>

          <span className="digital-twin-label">
            Coastal
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.coastal.status}
          </strong>

          <small>
            Change: {layers.coastal.change}%
          </small>

        </div>


        {/* Ecosystem Health */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-green">
            <CheckCircle size={24} />
          </div>

          <span className="digital-twin-label">
            Ecosystem Health
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.ecosystem_health.status}
          </strong>

          <small>
            Score: {layers.ecosystem_health.score}
          </small>

        </div>


        {/* Ecosystem Risk */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-orange">
            <AlertTriangle size={24} />
          </div>

          <span className="digital-twin-label">
            Ecosystem Risk
          </span>

          <strong className="digital-twin-value digital-good">
            {layers.ecosystem_risk.risk}
          </strong>

          <small>
            Current risk level
          </small>

        </div>


        {/* Restoration */}

        <div className="digital-twin-card">

          <div className="digital-twin-icon digital-icon-orange">
            <Target size={24} />
          </div>

          <span className="digital-twin-label">
            Restoration
          </span>

          <strong className="digital-twin-value digital-medium">
            {layers.restoration.priority}
          </strong>

          <small>
            Priority level
          </small>

        </div>

      </div>


      {/* =========================
          DATA SOURCE
      ========================= */}

      <div className="digital-twin-footer">

        <span>
          Data Source:
        </span>

        <strong>
          {data.data_source}
        </strong>

      </div>

    </section>
  );
}

export default DigitalTwinSummary;