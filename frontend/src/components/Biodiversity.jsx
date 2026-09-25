import { useEffect, useState } from "react";
import {
  Leaf,
  PawPrint,
  Trees,
  CheckCircle
} from "lucide-react";

function Biodiversity({ selectedLocation, predictionDate }) {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {
      setData(null);
      return;
    }

    const fetchBiodiversity = async () => {

      setLoading(true);
      setError("");

      try {

        const { latitude, longitude } = selectedLocation;

        const response = await fetch(
          `http://127.0.0.1:8000/api/biodiversity?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
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
          "Unable to retrieve biodiversity data."
        );

      } finally {

        setLoading(false);

      }
    };

    fetchBiodiversity();

  }, [selectedLocation, predictionDate]);


  // ==================================================
  // NO LOCATION
  // ==================================================

  if (!selectedLocation) {
    return (
      <section className="biodiversity-section">

        <div className="biodiversity-message">
          Select a location on the ocean map to view biodiversity.
        </div>

      </section>
    );
  }


  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <section className="biodiversity-section">

        <div className="biodiversity-message">
          Loading biodiversity data...
        </div>

      </section>
    );
  }


  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <section className="biodiversity-section">

        <div className="biodiversity-message error">
          {error}
        </div>

      </section>
    );
  }


  // ==================================================
  // DATA
  // ==================================================

  if (!data) {
    return null;
  }


  return (
    <section className="biodiversity-section">

      {/* HEADER */}

      <div className="biodiversity-header">

        <div>

          <h2>
            Biodiversity & Habitat
          </h2>

          <p>
            Ecological indicators for the selected
            ocean location.
          </p>

        </div>

        <span className="biodiversity-badge">
          Prototype Data
        </span>

      </div>


      {/* LOCATION */}

      <div className="biodiversity-location">

        <span>📍 Location:</span>

        <strong>
          {Number(selectedLocation.latitude).toFixed(3)}°N,
          {" "}
          {Number(selectedLocation.longitude).toFixed(3)}°E
        </strong>

        <span>•</span>

        <span>Date:</span>

        <strong>
          {data.date}
        </strong>

      </div>


      {/* INDICATORS */}

      <div className="biodiversity-grid">


        {/* SPECIES RICHNESS */}

        <div className="biodiversity-card">

          <div className="biodiversity-icon">
            <PawPrint size={25} />
          </div>

          <div>

            <span className="biodiversity-label">
              Species Richness
            </span>

            <strong>
              {data.indicators.species_richness.value}
            </strong>

            <small>
              index
            </small>

          </div>

        </div>


        {/* BIODIVERSITY SCORE */}

        <div className="biodiversity-card">

          <div className="biodiversity-icon">
            <Leaf size={25} />
          </div>

          <div>

            <span className="biodiversity-label">
              Biodiversity Score
            </span>

            <strong>
              {data.indicators.biodiversity_score.value}
            </strong>

            <small>
              / 100
            </small>

          </div>

        </div>


        {/* HABITAT DIVERSITY */}

        <div className="biodiversity-card">

          <div className="biodiversity-icon">
            <Trees size={25} />
          </div>

          <div>

            <span className="biodiversity-label">
              Habitat Diversity
            </span>

            <strong>
              {data.indicators.habitat_diversity.value}
            </strong>

            <small>
              index
            </small>

          </div>

        </div>

      </div>


      {/* STATUS */}

      <div className="biodiversity-status">

        <CheckCircle size={25} />

        <div>

          <span>
            Biodiversity Status
          </span>

          <strong>
            {data.biodiversity_status}
          </strong>

        </div>

      </div>


    </section>
  );
}

export default Biodiversity;