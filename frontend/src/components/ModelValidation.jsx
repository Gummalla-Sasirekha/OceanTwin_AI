import "./ModelValidation.css";

function ModelValidation() {
  return (
    <section className="model-validation-section">

      {/* HEADER */}
      <div className="model-validation-header">

        <p className="model-validation-tag">
          AI MODEL VALIDATION
        </p>

        <h2>
          Sea Surface Temperature Model Performance
        </h2>

        <p>
          Validation results for the NASA MUR SST prediction model
          over the Arabian Sea study region.
        </p>

        <span className="model-validation-badge">
          NASA MUR SST v4.2
        </span>

      </div>


      {/* DATASET INFO */}
      <div className="model-validation-info">

        <div>
          <span>Dataset</span>
          <strong>NASA MUR SST v4.2</strong>
        </div>

        <div>
          <span>Study Region</span>
          <strong>Arabian Sea</strong>
        </div>

        <div>
          <span>Training Period</span>
          <strong>Jan – Sep 2020</strong>
        </div>

        <div>
          <span>Testing Period</span>
          <strong>Oct – Dec 2020</strong>
        </div>

      </div>


      {/* METRICS */}
      <div className="model-validation-grid">

        <div className="validation-card">

          <div className="validation-card-label">
            MAE
          </div>

          <strong className="validation-value">
            0.1239
          </strong>

          <span>
            °C
          </span>

          <small>
            Mean Absolute Error
          </small>

        </div>


        <div className="validation-card">

          <div className="validation-card-label">
            RMSE
          </div>

          <strong className="validation-value">
            0.1659
          </strong>

          <span>
            °C
          </span>

          <small>
            Root Mean Square Error
          </small>

        </div>


        <div className="validation-card">

          <div className="validation-card-label">
            R²
          </div>

          <strong className="validation-value">
            0.9641
          </strong>

          <span>
            score
          </span>

          <small>
            Coefficient of Determination
          </small>

        </div>

      </div>


      {/* RESULT SUMMARY */}
      <div className="model-validation-result">

        <div className="validation-result-icon">
          ✓
        </div>

        <div>

          <span>
            Model Validation Result
          </span>

          <strong>
            SST prediction model successfully evaluated
          </strong>

          <small>
            Evaluation performed using the held-out 2020 test period.
          </small>

        </div>

      </div>


      {/* SCIENTIFIC NOTE */}
      <div className="model-validation-note">

        <strong>
          Validation Note:
        </strong>

        <span>
          These metrics describe the performance of the trained
          NASA MUR SST prediction model. Other ecosystem indicators
          currently shown in OceanTwin-AI are prototype indicators
          and are not presented as measured field observations.
        </span>

      </div>

    </section>
  )
}

export default ModelValidation