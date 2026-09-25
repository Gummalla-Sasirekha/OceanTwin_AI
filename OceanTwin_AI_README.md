# OceanTwin AI 🌊

**A Digital Twin Platform for the Valapattanam Mangrove Ecosystem, Kannur, Kerala**

OceanTwin AI is an AI-powered digital twin framework for coastal ecosystem monitoring and decision support. The platform integrates environmental data, geospatial visualization, AI/ML prediction, ecosystem indicators, risk assessment, and restoration-priority analysis within a unified interface.

> **Project scope:** Valapattanam Mangrove Ecosystem, Kannur, Kerala is used as the testing and validation site. The long-term framework is intended for diverse coastal ecosystems rather than a single location.

## Overview

Mangrove ecosystems support biodiversity, shoreline protection, and climate regulation. Conventional monitoring is often manual and periodic, making continuous assessment of environmental change difficult.

OceanTwin AI addresses this challenge by integrating:

- Satellite and environmental datasets
- Geospatial/GIS layers
- Spatial and temporal data processing
- AI/ML-based environmental prediction
- Interactive digital-twin visualization
- Ecosystem-health indicators
- Risk assessment
- Restoration-priority decision support

## Key Objectives

1. Develop an AI-powered digital twin platform for coastal ecosystem monitoring.
2. Integrate satellite, environmental, and geospatial data into a unified GIS platform.
3. Apply AI/ML to predict environmental conditions and identify ecosystem risks.
4. Monitor water quality, biodiversity, habitat health, pollution, and coastal change.
5. Provide ecosystem-health, risk-assessment, and restoration-priority insights.
6. Demonstrate the platform using the Valapattanam Mangrove Ecosystem as a testing and validation site.

## System Architecture

**Data Collection → Data Integration → Geospatial Processing → AI/ML Analysis → Digital Twin Platform → Ecosystem Assessment → Decision Support**

### Data Sources

- NASA MUR Sea Surface Temperature (SST) v4.2
- Satellite imagery
- Drone surveys
- Field observations
- Public environmental datasets
- GIS/geospatial layers

## NASA MUR SST Model

The current quantitatively validated AI component uses the **GHRSST Level 4 MUR Sea Surface Temperature v4.2** dataset.

- **Study region:** Arabian Sea
- **Spatial resolution:** 0.25° × 0.25°
- **Study year:** 2020
- **Training period:** January–September 2020
- **Testing period:** October–December 2020
- **Target:** Next-day sea surface temperature

### Model Validation

| Metric | Result |
|---|---:|
| MAE | 0.1239 °C |
| RMSE | 0.1659 °C |
| R² | 0.9641 |

Example prediction:

- Location: 12.625°N, 63.125°E
- Date: 1 October 2020
- Today's SST: 27.926 °C
- Predicted next-day SST: 28.019 °C

### Scientific Scope Note

The SST prediction model is quantitatively validated using NASA MUR SST data.

The broader ecosystem indicators currently implemented in the digital twin are **prototype decision-support indicators** and should not be interpreted as measured field observations.

## Digital Twin Features

### GIS & Environmental Visualization

- Interactive coastal/ocean map
- Environmental data layers
- NASA MUR SST visualization
- Selected-location intelligence popup
- Spatial visualization of environmental conditions

### Ecosystem Intelligence

The prototype includes indicators for:

- Water quality
- Biodiversity
- Pollution
- Habitat health
- Coastal change
- Overall ecosystem health

### Decision Support

- Ecosystem risk assessment
- Environmental risk indicators
- Restoration-priority assessment
- Scenario-based insights
- Alerts and predictive insights

## Technology Stack

### Frontend

- React
- Vite
- React-Leaflet / Leaflet
- Recharts
- Lucide React
- CSS

### Backend

- Python
- FastAPI
- CORS
- REST API

### Data & Geospatial Processing

- Pandas
- NumPy
- GeoPandas
- Rasterio
- xarray
- NetCDF-based environmental data processing

### Machine Learning

- Python-based ML workflow
- NASA MUR SST training and validation
- Spatial and temporal environmental features

## Project Structure

```text
OceanTwin_AI/
├── backend/
├── frontend/
├── ml/
├── database/
├── gis/
├── .gitignore
└── README.md
```

## Running the Project

### 1. Clone the repository

```bash
git clone https://github.com/Gummalla-Sasirekha/OceanTwin_AI.git
cd OceanTwin_AI
```

### 2. Backend

From the `backend` directory, start the FastAPI application:

```bash
uvicorn main:app --reload
```

### 3. Frontend

From the `frontend` directory:

```bash
npm install
npm run dev
```

Open the Vite development URL shown in the terminal.

## API

The backend currently provides endpoints including:

- `GET /`
- `GET /api/health`
- `GET /api/ocean-status`
- `POST /api/predict`
- `POST /api/predict-sst`
- `GET /api/get-sst`
- `GET /api/sst-trend`
- `GET /api/info`
- `GET /api/water-quality`
- `GET /api/biodiversity`
- `GET /api/pollution`
- `GET /api/habitat-change`
- `GET /api/coastal-change`
- `GET /api/ecosystem-health`
- `GET /api/risk-assessment`
- `GET /api/restoration-priority`
- `GET /api/digital-twin-summary`

## Results

The validated SST model achieved:

- **MAE:** 0.1239 °C
- **RMSE:** 0.1659 °C
- **R²:** 0.9641

The prototype also integrates GIS visualization, ecosystem indicators, risk assessment, restoration-priority analysis, and decision-support views into the digital twin interface.

## Future Work

- Real-time integration of satellite, IoT, field-survey, and public environmental datasets
- Training across diverse coastal ecosystems
- Validated satellite-based mangrove, habitat, and coastal change detection
- Improved data-driven AI risk and restoration models
- Operational digital twin with continuous updates, alerts, forecasting, and scenario-based decision support

## Data Source

NASA MUR Sea Surface Temperature v4.2:

https://podaac.jpl.nasa.gov/dataset/MUR25-JPL-L4-GLOB-v04.2

## Project

**OceanTwin AI**  
Department of Computer Science  
Chinmaya Vishwavidyapeeth Deemed to be University  
Ernakulam-686667, Kerala, India

**Authors**

- Gummalla Sasirekha
- Mohammed Syed Marjuk
- Anupama Jims

**Corresponding Author:** anupama.jims@cvv.ac.in

---

This project is an academic prototype demonstrating a digital-twin approach for coastal ecosystem monitoring, prediction, and decision support.
