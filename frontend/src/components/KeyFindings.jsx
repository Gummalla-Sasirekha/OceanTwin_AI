import "./KeyFindings.css";

function KeyFindings() {
  return (
    <section className="key-findings-section">

      {/* HEADER */}
      <div className="key-findings-header">

        <p className="key-findings-tag">
          KEY FINDINGS
        </p>

        <h2>
          OceanTwin-AI Results
        </h2>

        <p>
          Summary of the current prototype results and model validation.
        </p>

      </div>


      {/* FINDINGS */}
      <div className="key-findings-grid">

        {/* SST MODEL */}
        <div className="finding-card">

          <div className="finding-icon">
            🌡️
          </div>

          <h3>
            SST Prediction
          </h3>

          <p>
            The trained NASA MUR SST model was evaluated on a
            held-out 2020 test period.
          </p>

          <strong>
            MAE: 0.1239 °C
          </strong>

        </div>


        {/* MODEL FIT */}
        <div className="finding-card">

          <div className="finding-icon">
            📊
          </div>

          <h3>
            Model Performance
          </h3>

          <p>
            The validation produced an RMSE of 0.1659 °C and
            an R² score of 0.9641.
          </p>

          <strong>
            R²: 0.9641
          </strong>

        </div>


        {/* DIGITAL TWIN */}
        <div className="finding-card">

          <div className="finding-icon">
            🌊
          </div>

          <h3>
            Digital Twin Integration
          </h3>

          <p>
            Environmental indicators are unified into a single
            GIS-based digital twin view for the selected location.
          </p>

          <strong>
            Digital Twin: Active
          </strong>

        </div>


        {/* DECISION SUPPORT */}
        <div className="finding-card">

          <div className="finding-icon">
            🎯
          </div>

          <h3>
            Decision Support
          </h3>

          <p>
            The prototype connects ecosystem health, risk and
            restoration-priority indicators within one platform.
          </p>

          <strong>
            Restoration: Medium
          </strong>

        </div>

      </div>


      {/* IMPORTANT SCIENTIFIC NOTE */}

      <div className="key-findings-note">

        <strong>
          Prototype Scope:
        </strong>

        <span>
          Ecosystem indicators such as biodiversity, pollution,
          habitat and coastal condition are currently prototype
          indicators. They are not presented as measured field
          observations.
        </span>

      </div>

    </section>
  );
}

export default KeyFindings;