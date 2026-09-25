import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMapEvents,
} from 'react-leaflet'

import { useEffect, useRef, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import './OceanMap.css'


// ==================================================
// SAMPLE OCEAN LOCATIONS
// ==================================================

const oceanLocations = [
  {
    name: 'Arabian Sea',
    position: [15.0, 68.0],
    temperature: '28.4°C',
    salinity: '36.2 PSU',
    status: 'Healthy',
  },
  {
    name: 'Bay of Bengal',
    position: [15.0, 88.0],
    temperature: '29.1°C',
    salinity: '34.8 PSU',
    status: 'Moderate',
  },
  {
    name: 'Indian Ocean',
    position: [-10.0, 75.0],
    temperature: '26.8°C',
    salinity: '35.4 PSU',
    status: 'Healthy',
  },
]


// ==================================================
// MAP CLICK HANDLER
// ==================================================

function MapClickHandler({ onLocationSelect }) {

  useMapEvents({

    click: (event) => {

      const lat = event.latlng.lat
      const lng = event.latlng.lng


      // ============================================
      // AI PREDICTION REGION
      // ============================================

      const LAT_MIN = 5
      const LAT_MAX = 20

      const LON_MIN = 60
      const LON_MAX = 75


      // ============================================
      // CHECK REGION
      // ============================================

      if (
        lat < LAT_MIN ||
        lat > LAT_MAX ||
        lng < LON_MIN ||
        lng > LON_MAX
      ) {

        alert(
          '⚠️ This location is outside the current AI prediction region. Please select a location within the Arabian Sea study region (5–20°N, 60–75°E).'
        )

        return
      }


      // ============================================
      // SEND LOCATION TO APP
      // ============================================

      onLocationSelect({
        latitude: lat,
        longitude: lng,
      })

    },

  })

  return null
}


// ==================================================
// SELECTED LOCATION MARKER
// ==================================================

function SelectedLocationMarker({
  selectedLocation,
  sstToday,
  predictedSst,
  predictionDate,
}) {

  const markerRef = useRef(null)

  const [digitalTwinData, setDigitalTwinData] = useState(null)


  // ==================================================
  // FETCH DIGITAL TWIN SUMMARY
  // ==================================================

  useEffect(() => {

    if (!selectedLocation || !predictionDate) {

      setDigitalTwinData(null)

      return
    }


    const fetchDigitalTwinData = async () => {

      try {

        const {
          latitude,
          longitude,
        } = selectedLocation


        const response = await fetch(
          `http://127.0.0.1:8000/api/digital-twin-summary?latitude=${latitude}&longitude=${longitude}&date=${predictionDate}`
        )


        if (!response.ok) {

          throw new Error(
            `Server error: ${response.status}`
          )

        }


        const result = await response.json()


        if (result.error) {

          throw new Error(
            result.error
          )

        }


        setDigitalTwinData(result)

      } catch (error) {

        console.error(
          'Digital Twin popup error:',
          error
        )

        setDigitalTwinData(null)

      }

    }


    fetchDigitalTwinData()

  }, [
    selectedLocation,
    predictionDate,
  ])


  // ==================================================
  // AUTOMATICALLY OPEN POPUP
  // ==================================================

  useEffect(() => {

    if (
      markerRef.current &&
      selectedLocation
    ) {

      markerRef.current.openPopup()

    }

  }, [
    selectedLocation?.latitude,
    selectedLocation?.longitude,
    sstToday,
    predictedSst,
    digitalTwinData,
  ])


  // ==================================================
  // NO SELECTED LOCATION
  // ==================================================

  if (!selectedLocation) {

    return null

  }


  return (

    <CircleMarker

      ref={markerRef}

      center={[
        selectedLocation.latitude,
        selectedLocation.longitude,
      ]}

      radius={12}

      pathOptions={{
        color: '#ff4d6d',
        fillColor: '#ff4d6d',
        fillOpacity: 0.9,
        weight: 3,
      }}

    >

      <Popup>

        <div className="map-popup">

          {/* ======================================
              HEADER
              ====================================== */}

          <h3>
            🤖 OceanTwin-AI Location
          </h3>


          {/* ======================================
              LOCATION
              ====================================== */}

          <p>

            <strong>
              Latitude:
            </strong>{' '}

            {selectedLocation.latitude.toFixed(3)}
            °N

          </p>


          <p>

            <strong>
              Longitude:
            </strong>{' '}

            {selectedLocation.longitude.toFixed(3)}
            °E

          </p>


          {/* ======================================
              TODAY'S SST
              ====================================== */}

          {sstToday && (

            <p>

              <strong>
                Today's SST:
              </strong>{' '}

              {Number(sstToday).toFixed(3)}
              °C

            </p>

          )}


          {/* ======================================
              TOMORROW'S SST
              ====================================== */}

          {predictedSst !== null && (

            <p>

              <strong>
                Tomorrow's SST:
              </strong>{' '}

              {Number(predictedSst).toFixed(3)}
              °C

            </p>

          )}


          {/* ======================================
              SST CHANGE
              ====================================== */}

          {predictedSst !== null && sstToday && (

            <p>

              <strong>
                SST Change:
              </strong>{' '}

              {(
                Number(predictedSst) -
                Number(sstToday)
              ).toFixed(3)}

              °C

            </p>

          )}


          {/* ======================================
              DATA SOURCE
              ====================================== */}

          <p>

            <strong>
              Data:
            </strong>{' '}

            NASA MUR SST v4.2

          </p>


          {/* ======================================
              MODEL
              ====================================== */}

          {predictedSst !== null && (

            <p>

              <strong>
                Model:
              </strong>{' '}

              Trained ML Model

            </p>

          )}


          {/* ======================================
              DIGITAL TWIN INTELLIGENCE
              ====================================== */}

          {digitalTwinData && (

            <>

              <hr />


              <h3>
                🌊 Digital Twin Intelligence
              </h3>


              {/* WATER QUALITY */}

              <p>

                💧 <strong>
                  Water Quality:
                </strong>{' '}

                {digitalTwinData.layers.water_quality.status}

              </p>


              {/* BIODIVERSITY */}

              <p>

                🐠 <strong>
                  Biodiversity:
                </strong>{' '}

                {digitalTwinData.layers.biodiversity.status}

                {' '}

                (
                {digitalTwinData.layers.biodiversity.score}
                )

              </p>


              {/* POLLUTION */}

              <p>

                🏭 <strong>
                  Pollution:
                </strong>{' '}

                {digitalTwinData.layers.pollution.status}

              </p>


              {/* POLLUTION RISK */}

              <p>

                ⚠️ <strong>
                  Pollution Risk:
                </strong>{' '}

                {digitalTwinData.layers.pollution.risk}

              </p>


              {/* HABITAT */}

              <p>

                🌿 <strong>
                  Habitat:
                </strong>{' '}

                {digitalTwinData.layers.habitat.status}

              </p>


              {/* COASTAL */}

              <p>

                🌊 <strong>
                  Coastal:
                </strong>{' '}

                {digitalTwinData.layers.coastal.status}

              </p>


              {/* ECOSYSTEM HEALTH */}

              <p>

                💚 <strong>
                  Ecosystem Health:
                </strong>{' '}

                {digitalTwinData.layers.ecosystem_health.score}
                /100

              </p>


              {/* ECOSYSTEM RISK */}

              <p>

                ⚠️ <strong>
                  Ecosystem Risk:
                </strong>{' '}

                {digitalTwinData.layers.ecosystem_risk.risk}

              </p>


              {/* RESTORATION */}

              <p>

                🎯 <strong>
                  Restoration Priority:
                </strong>{' '}

                {digitalTwinData.layers.restoration.priority}

              </p>


              <hr />


              {/* DIGITAL TWIN STATUS */}

              <p>

                <strong>
                  Digital Twin Status:
                </strong>{' '}

                {digitalTwinData.digital_twin_status}

              </p>

            </>

          )}

        </div>

      </Popup>

    </CircleMarker>

  )
}


// ==================================================
// OCEAN MAP
// ==================================================

function OceanMap({
  onLocationSelect,
  selectedLocation,
  sstToday,
  predictedSst,
  predictionDate,
}) {

  return (

    <section
      className="map-section"
      id="map"
    >

      {/* ==========================================
          HEADING
          ========================================== */}

      <div className="map-heading">

        <p className="map-tag">
          GEOSPATIAL OCEAN INTELLIGENCE
        </p>


        <h2>
          Interactive Ocean Map
        </h2>


        <p>
          Explore marine regions and view environmental
          conditions monitored by OceanTwin-AI.
        </p>


        <p>
          📍 <strong>
            Click inside the Arabian Sea study region
          </strong>{' '}
          to select a location for AI prediction.
        </p>


        <p>
          <strong>
            AI Prediction Region:
          </strong>{' '}
          5–20°N, 60–75°E
        </p>

      </div>


      {/* ==========================================
          MAP
          ========================================== */}

      <div className="map-container">

        <MapContainer

          center={[10, 68]}

          zoom={5}

          scrollWheelZoom={true}

          className="ocean-map"

        >

          {/* ========================================
              BASE MAP
              ======================================== */}

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />


          {/* ========================================
              MAP CLICK HANDLER
              ======================================== */}

          <MapClickHandler
            onLocationSelect={onLocationSelect}
          />


          {/* ========================================
              EXISTING BLUE MARKERS
              ======================================== */}

          {oceanLocations.map((location) => (

            <CircleMarker

              key={location.name}

              center={location.position}

              radius={10}

              pathOptions={{
                color: '#0785ad',
                fillColor: '#18a8d0',
                fillOpacity: 0.8,
              }}

            >

              <Popup>

                <div className="map-popup">

                  <h3>
                    {location.name}
                  </h3>


                  <p>

                    <strong>
                      Temperature:
                    </strong>{' '}

                    {location.temperature}

                  </p>


                  <p>

                    <strong>
                      Salinity:
                    </strong>{' '}

                    {location.salinity}

                  </p>


                  <p>

                    <strong>
                      Status:
                    </strong>{' '}

                    {location.status}

                  </p>

                </div>

              </Popup>

            </CircleMarker>

          ))}


          {/* ========================================
              DIGITAL TWIN RING
              ======================================== */}

          {selectedLocation && (

            <CircleMarker

              center={[
                selectedLocation.latitude,
                selectedLocation.longitude,
              ]}

              radius={18}

              pathOptions={{
                color: '#7b2cbf',
                fillColor: '#9d4edd',
                fillOpacity: 0.12,
                weight: 3,
                dashArray: '6 5',
              }}

            />

          )}


          {/* ========================================
              SELECTED AI MARKER
              ======================================== */}

          <SelectedLocationMarker

            selectedLocation={selectedLocation}

            sstToday={sstToday}

            predictedSst={predictedSst}

            predictionDate={predictionDate}

          />

        </MapContainer>

      </div>

    </section>

  )

}


export default OceanMap