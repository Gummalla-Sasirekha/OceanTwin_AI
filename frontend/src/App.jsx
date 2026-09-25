import { useEffect, useState } from 'react'
import './App.css'

import OceanMap from "./components/OceanMap";
import OceanData from "./components/OceanData";
import SSTTrend from "./components/SSTTrend";
import WaterQuality from "./components/WaterQuality";
import Biodiversity from "./components/Biodiversity";
import Pollution from "./components/Pollution";
import HabitatChange from "./components/HabitatChange";
import CoastalChange from "./components/CoastalChange";
import EcosystemHealth from "./components/EcosystemHealth";
import RiskAssessment from "./components/RiskAssessment";
import RestorationPriority from "./components/RestorationPriority";
import DigitalTwinSummary from "./components/DigitalTwinSummary";
import ModelValidation from "./components/ModelValidation";
import KeyFindings from "./components/KeyFindings";

function App() {

  // ==================================================
  // LOCATION
  // ==================================================

  const [latitude, setLatitude] = useState('12.625')
  const [longitude, setLongitude] = useState('63.125')


  // ==================================================
  // DATE
  // ==================================================

  const [predictionDate, setPredictionDate] =
    useState('2020-10-01')


  // ==================================================
  // SST
  // ==================================================

  const [sstToday, setSstToday] = useState('')


  // ==================================================
  // PREDICTION
  // ==================================================

  const [predictedSst, setPredictedSst] = useState(null)


  // ==================================================
  // LOADING / ERROR
  // ==================================================

  const [loadingSst, setLoadingSst] = useState(false)
  const [loadingPrediction, setLoadingPrediction] =
    useState(false)

  const [error, setError] = useState('')


  // ==================================================
  // SELECTED MAP LOCATION
  // ==================================================

  const [selectedLocation, setSelectedLocation] =
    useState({
      latitude: 12.625,
      longitude: 63.125,
    })


  // ==================================================
  // GET SST FROM NASA DATA
  // ==================================================

  const getSST = async (
    selectedLatitude,
    selectedLongitude,
    selectedDate
  ) => {

    setLoadingSst(true)
    setError('')
    setPredictedSst(null)

    try {

      const response = await fetch(
        'http://127.0.0.1:8000/api/get-sst',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({
            latitude: Number(selectedLatitude),
            longitude: Number(selectedLongitude),
            date: selectedDate,
          }),
        }
      )


      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        )

      }


      const data = await response.json()


      if (data.error) {

        throw new Error(data.error)

      }


      // Update today's SST
      setSstToday(
        Number(data.sst_celsius).toFixed(3)
      )


    } catch (err) {

      console.error(err)

      setSstToday('')

      setError(
        err.message ||
        'Unable to retrieve NASA SST data.'
      )

    } finally {

      setLoadingSst(false)

    }

  }


  // ==================================================
  // MAP LOCATION SELECTED
  // ==================================================

  const handleLocationSelect = ({
    latitude: selectedLatitude,
    longitude: selectedLongitude,
  }) => {

    // Update selected location
    setSelectedLocation({
      latitude: selectedLatitude,
      longitude: selectedLongitude,
    })


    // Update input fields
    setLatitude(
      selectedLatitude.toFixed(3)
    )

    setLongitude(
      selectedLongitude.toFixed(3)
    )


    // Retrieve NASA SST
    getSST(
      selectedLatitude,
      selectedLongitude,
      predictionDate
    )


    // Scroll to prediction section
    setTimeout(() => {

      document
        .getElementById('predictions')
        ?.scrollIntoView({
          behavior: 'smooth',
        })

    }, 100)

  }


  // ==================================================
  // UPDATE SST WHEN DATE CHANGES
  // ==================================================

  useEffect(() => {

    if (
      latitude &&
      longitude &&
      predictionDate
    ) {

      getSST(
        Number(latitude),
        Number(longitude),
        predictionDate
      )

    }

  }, [predictionDate])


  // ==================================================
  // DAY OF YEAR
  // ==================================================

  const getDayOfYear = (dateString) => {

    const date = new Date(
      `${dateString}T00:00:00`
    )

    const start = new Date(
      date.getFullYear(),
      0,
      0
    )

    const difference =
      date - start

    return Math.floor(
      difference /
      (1000 * 60 * 60 * 24)
    )

  }


  // ==================================================
  // PREDICT TOMORROW'S SST
  // ==================================================

  const predictSST = async () => {

    if (!sstToday) {

      setError(
        'SST data is not available for this location.'
      )

      return

    }


    setLoadingPrediction(true)
    setError('')
    setPredictedSst(null)


    try {

      const date = new Date(
        `${predictionDate}T00:00:00`
      )

      const dayOfYear =
        getDayOfYear(predictionDate)

      const month =
        date.getMonth() + 1


      const response = await fetch(
        'http://127.0.0.1:8000/api/predict-sst',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },

          body: JSON.stringify({

            latitude: Number(latitude),

            longitude: Number(longitude),

            day_of_year: dayOfYear,

            month: month,

            sst_today: Number(sstToday),

          }),
        }
      )


      if (!response.ok) {

        throw new Error(
          `Server error: ${response.status}`
        )

      }


      const data =
        await response.json()


      if (data.error) {

        throw new Error(data.error)

      }


      setPredictedSst(
        data.prediction
          .predicted_sst_tomorrow
      )


    } catch (err) {

      console.error(err)

      setError(
        err.message ||
        'Unable to generate prediction.'
      )

    } finally {

      setLoadingPrediction(false)

    }

  }


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="app">


      {/* ==================================================
          NAVIGATION
          ================================================== */}

      <header className="navbar">

        <div className="logo">
          🌊 <span>OceanTwin-AI</span>
        </div>


        <nav>

          <a href="#dashboard">
            Dashboard
          </a>

          <a href="#map">
            Ocean Map
          </a>

          <a href="#predictions">
            Predictions
          </a>

          <a href="#about">
            About
          </a>

        </nav>

      </header>


      <main>


        {/* ==================================================
            HERO
            ================================================== */}

        <section
          className="hero"
          id="dashboard"
        >

          <div className="hero-content">

            <p className="tag">
              AI-POWERED OCEAN INTELLIGENCE
            </p>


            <h1>

              Digital Twin for a

              <span>
                {' '}Smarter Ocean
              </span>

            </h1>


            <p className="description">

              Monitor ocean conditions, visualize
              marine data and generate intelligent
              predictions using AI-powered digital
              twin technology.

            </p>


            <div className="buttons">

              <button
                className="primary-btn"
                onClick={() =>
                  document
                    .getElementById('map')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    })
                }
              >
                Explore Ocean Map
              </button>


              <button
                className="secondary-btn"
                onClick={() =>
                  document
                    .getElementById('predictions')
                    ?.scrollIntoView({
                      behavior: 'smooth',
                    })
                }
              >
                View Predictions
              </button>

            </div>

          </div>


          {/* OCEAN STATUS */}

          <div className="ocean-card">

            <div className="wave">
              🌊
            </div>

            <h2>
              Ocean Status
            </h2>

            <p>
              AI monitoring system
            </p>

            <div className="status">

              <span></span>

              System Online

            </div>

          </div>

        </section>


        {/* ==================================================
            FEATURES
            ================================================== */}

        <section className="features">

          <div className="feature-card">

            <div className="icon">
              🗺️
            </div>

            <h3>
              Ocean Mapping
            </h3>

            <p>
              Visualize ocean regions and environmental
              data through an interactive digital map.
            </p>

          </div>


          <div className="feature-card">

            <div className="icon">
              🤖
            </div>

            <h3>
              AI Predictions
            </h3>

            <p>
              Use machine learning models to analyze
              ocean conditions and predict future changes.
            </p>

          </div>


          <div className="feature-card">

            <div className="icon">
              📊
            </div>

            <h3>
              Data Analytics
            </h3>

            <p>
              Analyze temperature, salinity, waves and
              other ocean parameters in one place.
            </p>

          </div>

        </section>


        {/* ==================================================
            INTERACTIVE MAP
            ================================================== */}

        <OceanMap

          onLocationSelect={
            handleLocationSelect
          }

          selectedLocation={
            selectedLocation
          }

          sstToday={
            sstToday
          }

          predictedSst={
            predictedSst

          }

          predictionDate={
            predictionDate
          }

        />


        {/* OCEAN DATA */}

        <OceanData />
        <WaterQuality
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <Biodiversity
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <Pollution
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <HabitatChange
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <CoastalChange
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <EcosystemHealth
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <RiskAssessment
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <RestorationPriority
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <DigitalTwinSummary
          selectedLocation={selectedLocation}
          predictionDate={predictionDate}
        />

        <ModelValidation />

        <KeyFindings />
        <SSTTrend />


        {/* ==================================================
            AI PREDICTION SECTION
            ================================================== */}

        <section
          className="prediction-section"
          id="predictions"
          style={{
            padding: '70px 7%',
            background: '#f4fbff',
          }}
        >

          <div
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >

            <p className="tag">
              AI PREDICTION ENGINE
            </p>


            <h2
              style={{
                fontSize: '36px',
                margin: '10px 0 15px',
                color: '#123047',
              }}
            >
              Next-Day Sea Surface Temperature
            </h2>


            <p
              style={{
                maxWidth: '700px',
                margin: '0 auto 35px',
                color: '#607786',
                lineHeight: '1.7',
              }}
            >
              OceanTwin-AI retrieves NASA MUR SST
              data for the selected location and uses
              a trained machine learning model to
              predict tomorrow's sea surface temperature.
            </p>


            {/* ==================================================
                INPUT CARD
                ================================================== */}

            <div
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '18px',
                boxShadow:
                  '0 10px 30px rgba(0,0,0,0.08)',
                textAlign: 'left',
              }}
            >

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '20px',
                }}
              >


                {/* LATITUDE */}

                <div>

                  <label>
                    Latitude
                  </label>

                  <input
                    type="number"
                    step="0.125"
                    value={latitude}
                    onChange={(e) =>
                      setLatitude(
                        e.target.value
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '8px',
                      border:
                        '1px solid #cbdbe3',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing:
                        'border-box',
                    }}
                  />

                </div>


                {/* LONGITUDE */}

                <div>

                  <label>
                    Longitude
                  </label>

                  <input
                    type="number"
                    step="0.125"
                    value={longitude}
                    onChange={(e) =>
                      setLongitude(
                        e.target.value
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '8px',
                      border:
                        '1px solid #cbdbe3',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing:
                        'border-box',
                    }}
                  />

                </div>


                {/* TODAY'S SST */}

                <div>

                  <label>
                    Today's SST (°C)
                  </label>

                  <input
                    type="number"
                    value={sstToday}
                    readOnly
                    placeholder={
                      loadingSst
                        ? 'Loading NASA SST...'
                        : 'Select a map location'
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '8px',
                      border:
                        '1px solid #cbdbe3',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing:
                        'border-box',
                      background:
                        '#f5f9fb',
                    }}
                  />

                </div>


                {/* DATE */}

                <div>

                  <label>
                    Date
                  </label>

                  <input
                    type="date"
                    value={predictionDate}
                    onChange={(e) =>
                      setPredictionDate(
                        e.target.value
                      )
                    }
                    style={{
                      width: '100%',
                      padding: '12px',
                      marginTop: '8px',
                      border:
                        '1px solid #cbdbe3',
                      borderRadius: '8px',
                      fontSize: '15px',
                      boxSizing:
                        'border-box',
                    }}
                  />

                </div>

              </div>


              {/* ==================================================
                  NASA STATUS
                  ================================================== */}

              {loadingSst && (

                <p
                  style={{
                    marginTop: '15px',
                    color: '#087ea4',
                    textAlign: 'center',
                  }}
                >
                  🛰️ Retrieving NASA MUR SST data...
                </p>

              )}


              {!loadingSst && sstToday && (

                <p
                  style={{
                    marginTop: '15px',
                    color: '#4c6875',
                    textAlign: 'center',
                  }}
                >
                  🛰️ SST retrieved from{' '}

                  <strong>
                    NASA MUR SST v4.2
                  </strong>

                </p>

              )}


              {/* ==================================================
                  ERROR
                  ================================================== */}

              {error && (

                <div
                  style={{
                    marginTop: '20px',
                    padding: '15px',
                    borderRadius: '10px',
                    background: '#fff1f1',
                    color: '#b42318',
                  }}
                >
                  ⚠️ {error}
                </div>

              )}


              {/* ==================================================
                  PREDICT BUTTON
                  ================================================== */}

              <button
                onClick={predictSST}

                disabled={
                  loadingPrediction ||
                  loadingSst ||
                  !sstToday
                }

                style={{
                  marginTop: '25px',
                  width: '100%',
                  padding: '14px',
                  border: 'none',
                  borderRadius: '10px',
                  background: '#087ea4',
                  color: 'white',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor:
                    loadingPrediction ||
                    loadingSst ||
                    !sstToday
                      ? 'not-allowed'
                      : 'pointer',
                  opacity:
                    loadingPrediction ||
                    loadingSst ||
                    !sstToday
                      ? 0.7
                      : 1,
                }}
              >

                {loadingPrediction
                  ? '🤖 Generating Prediction...'
                  : "🤖 Predict Tomorrow's SST"}

              </button>


              {/* ==================================================
                  PREDICTION RESULT
                  ================================================== */}

              {predictedSst !== null && (

                <div
                  style={{
                    marginTop: '25px',
                    padding: '25px',
                    borderRadius: '14px',
                    background: '#eaf8ff',
                    textAlign: 'center',
                  }}
                >

                  <p
                    style={{
                      margin: 0,
                      color: '#607786',
                    }}
                  >
                    AI Predicted SST for Tomorrow
                  </p>


                  <div
                    style={{
                      fontSize: '42px',
                      fontWeight: '700',
                      color: '#087ea4',
                      margin: '10px 0',
                    }}
                  >
                    {Number(predictedSst).toFixed(3)}
                    °C
                  </div>


                  <p
                    style={{
                      margin: 0,
                      color: '#607786',
                    }}
                  >
                    📍{' '}

                    {Number(latitude).toFixed(3)}
                    °N,{' '}

                    {Number(longitude).toFixed(3)}
                    °E

                  </p>


                  <p
                    style={{
                      marginTop: '10px',
                      color: '#607786',
                    }}
                  >
                    Model status:{' '}

                    <strong>
                      Trained AI
                    </strong>

                  </p>

                </div>

              )}

            </div>

          </div>

        </section>


        {/* ==================================================
            STATISTICS
            ================================================== */}

        <section className="stats">

          <div>
            <strong>24/7</strong>
            <span>Monitoring</span>
          </div>

          <div>
            <strong>AI</strong>
            <span>Predictions</span>
          </div>

          <div>
            <strong>NASA</strong>
            <span>Satellite Data</span>
          </div>

          <div>
            <strong>∞</strong>
            <span>Possibilities</span>
          </div>

        </section>


        {/* ==================================================
            ABOUT
            ================================================== */}

        <section
          id="about"
          style={{
            padding: '60px 7%',
            textAlign: 'center',
          }}
        >

          <p className="tag">
            ABOUT OCEANTWIN-AI
          </p>


          <h2
            style={{
              fontSize: '36px',
              margin: '10px 0 15px',
              color: '#123047',
            }}
          >
            Building a Digital Twin of the Ocean
          </h2>


          <p
            style={{
              maxWidth: '700px',
              margin: '0 auto',
              color: '#607786',
              lineHeight: '1.7',
            }}
          >
            OceanTwin-AI combines geospatial data,
            environmental monitoring and artificial
            intelligence to understand ocean conditions,
            predict future changes and support smarter
            coastal and marine decision-making.
          </p>

        </section>

      </main>


      {/* ==================================================
          FOOTER
          ================================================== */}

      <footer>

        <p>
          © 2026 OceanTwin-AI • AI for a smarter
          and safer ocean
        </p>

      </footer>

    </div>
  )
}


export default App