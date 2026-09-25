import { useEffect, useState } from "react";
import {
  Thermometer,
  FlaskConical,
  Droplets,
  Waves,
  CheckCircle,
} from "lucide-react";

function WaterQuality({ selectedLocation, predictionDate }) {
  const [waterQuality, setWaterQuality] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // If no location has been selected yet
    if (!selectedLocation) {
      setWaterQuality(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const latitude = selectedLocation.latitude;
    const longitude = selectedLocation.longitude;

    const date = predictionDate || "2020-10-01";

    const url =
      `http://127.0.0.1:8000/api/water-quality` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&date=${date}`;

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch water quality");
        }

        return response.json();
      })
      .then((data) => {
        setWaterQuality(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Unable to load water quality data.");
        setLoading(false);
      });
  }, [selectedLocation, predictionDate]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <section className="water-quality-section">
        <div className="water-quality-message">
          Loading water quality data...
        </div>
      </section>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (error) {
    return (
      <section className="water-quality-section">
        <div className="water-quality-message error">
          {error}
        </div>
      </section>
    );
  }

  // ============================================================
  // NO LOCATION SELECTED
  // ============================================================

  if (!waterQuality) {
    return (
      <section className="water-quality-section">
        <div className="water-quality-message">
          Select a location on the ocean map to view water quality.
        </div>
      </section>
    );
  }

  // ============================================================
  // WATER QUALITY DATA
  // ============================================================

  const parameters = waterQuality.parameters;

  return (
    <section className="water-quality-section">

      {/* ======================================================
          HEADER
          ====================================================== */}

      <div className="water-quality-header">

        <div>
          <h2>Water Quality</h2>

          <p>
            Environmental indicators for the selected location
          </p>
        </div>

        <div className="water-quality-badge">
          Prototype Data
        </div>

      </div>


      {/* ======================================================
          SELECTED LOCATION
          ====================================================== */}

      <div className="water-quality-location">

        <span>
          Selected Location
        </span>

        <strong>
          {Number(waterQuality.location.latitude).toFixed(3)}°N,{" "}
          {Number(waterQuality.location.longitude).toFixed(3)}°E
        </strong>

        <span>
          Date: {waterQuality.date}
        </span>

      </div>


      {/* ======================================================
          PARAMETERS
          ====================================================== */}

      <div className="water-quality-grid">

        {/* ----------------------------------------------------
            TEMPERATURE
            ---------------------------------------------------- */}

        <div className="water-quality-card">

          <div className="water-quality-icon">
            <Thermometer size={24} />
          </div>

          <div>

            <span className="water-quality-label">
              Temperature
            </span>

            <strong>
              {parameters.temperature.value}{" "}
              {parameters.temperature.unit}
            </strong>

          </div>

        </div>


        {/* ----------------------------------------------------
            pH
            ---------------------------------------------------- */}

        <div className="water-quality-card">

          <div className="water-quality-icon">
            <FlaskConical size={24} />
          </div>

          <div>

            <span className="water-quality-label">
              pH
            </span>

            <strong>
              {parameters.ph.value}
            </strong>

          </div>

        </div>


        {/* ----------------------------------------------------
            DISSOLVED OXYGEN
            ---------------------------------------------------- */}

        <div className="water-quality-card">

          <div className="water-quality-icon">
            <Droplets size={24} />
          </div>

          <div>

            <span className="water-quality-label">
              Dissolved Oxygen
            </span>

            <strong>
              {parameters.dissolved_oxygen.value}{" "}
              {parameters.dissolved_oxygen.unit}
            </strong>

          </div>

        </div>


        {/* ----------------------------------------------------
            TURBIDITY
            ---------------------------------------------------- */}

        <div className="water-quality-card">

          <div className="water-quality-icon">
            <Waves size={24} />
          </div>

          <div>

            <span className="water-quality-label">
              Turbidity
            </span>

            <strong>
              {parameters.turbidity.value}{" "}
              {parameters.turbidity.unit}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================================
          OVERALL STATUS
          ====================================================== */}

      <div className="water-quality-status">

        <CheckCircle size={24} />

        <div>

          <span>
            Overall Water Quality
          </span>

          <strong>
            {waterQuality.quality_status}
          </strong>

        </div>

      </div>

    </section>
  );
}

export default WaterQuality;