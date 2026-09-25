import { useEffect, useState } from 'react'
import './OceanData.css'

function OceanData() {
  const [oceanData, setOceanData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/ocean-status')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch ocean data')
        }

        return response.json()
      })
      .then((data) => {
        setOceanData(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setError('Unable to connect to OceanTwin-AI backend')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <section className="data-section">
        <div className="data-heading">
          <p>OCEAN ENVIRONMENTAL DATA</p>
          <h2>Ocean Conditions</h2>
          <span>Loading ocean data...</span>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="data-section">
        <div className="data-heading">
          <p>OCEAN ENVIRONMENTAL DATA</p>
          <h2>Ocean Conditions</h2>
          <span>{error}</span>
        </div>
      </section>
    )
  }

  const dataCards = [
    {
      icon: '🌡️',
      name: 'Temperature',
      value: `${oceanData.temperature}°C`,
      description: 'Sea surface temperature',
    },
    {
      icon: '💧',
      name: 'Salinity',
      value: `${oceanData.salinity} PSU`,
      description: 'Average salinity level',
    },
    {
      icon: '🌊',
      name: 'Wave Height',
      value: `${oceanData.wave_height} m`,
      description: 'Current wave height',
    },
    {
      icon: '🧪',
      name: 'Water Quality',
      value: oceanData.water_quality,
      description: 'Overall water condition',
    },
    {
      icon: '🐠',
      name: 'Biodiversity',
      value: `${oceanData.biodiversity}%`,
      description: 'Estimated ecosystem health',
    },
    {
      icon: '⚠️',
      name: 'Pollution Risk',
      value: oceanData.pollution_risk,
      description: 'Current pollution risk',
    },
  ]

  return (
    <section className="data-section">
      <div className="data-heading">
        <p>OCEAN ENVIRONMENTAL DATA</p>

        <h2>Ocean Conditions</h2>

        <span>
          Monitor important environmental parameters across the
          selected ocean region.
        </span>
      </div>

      <div className="data-grid">
        {dataCards.map((data) => (
          <div className="data-card" key={data.name}>
            <div className="data-icon">{data.icon}</div>

            <div className="data-content">
              <h3>{data.name}</h3>

              <strong>{data.value}</strong>

              <span>{data.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default OceanData