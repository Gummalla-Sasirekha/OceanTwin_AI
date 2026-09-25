from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os


# ============================================================
# APP INITIALIZATION
# ============================================================

app = FastAPI(
    title="OceanTwin-AI API",
    description="AI and GIS backend for OceanTwin-AI coastal ecosystem platform",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "models",
    "sst_next_day_model.pkl"
)

SST_DATA_PATH = os.path.join(
    BASE_DIR,
    "ml",
    "data",
    "raw",
    "NASA_MUR_SST_2020_ArabianSea.csv"
)


# ============================================================
# LOAD TRAINED SST MODEL
# ============================================================

sst_model = None

try:
    sst_model = joblib.load(MODEL_PATH)
    print("SST prediction model loaded successfully.")

except Exception as e:
    print("WARNING: Could not load SST prediction model.")
    print("Error:", e)


# ============================================================
# LOAD NASA SST DATA
# ============================================================

sst_data = None

try:
    sst_data = pd.read_csv(SST_DATA_PATH)

    # Convert date column to datetime
    sst_data["date"] = pd.to_datetime(sst_data["date"])

    print("NASA SST dataset loaded successfully.")
    print("Rows:", len(sst_data))

except Exception as e:
    print("WARNING: Could not load NASA SST dataset.")
    print("Error:", e)


# ============================================================
# DATA MODELS
# ============================================================

class SSTPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    day_of_year: int
    month: int
    sst_today: float


class SSTRequest(BaseModel):
    latitude: float
    longitude: float
    date: str


class WaterQualityData(BaseModel):
    latitude: float
    longitude: float
    temperature: float
    ph: float
    dissolved_oxygen: float
    turbidity: float
    quality_status: str

class BiodiversityData(BaseModel):
    latitude: float
    longitude: float
    species_richness: float
    biodiversity_score: float
    habitat_diversity: float
    biodiversity_status: str

class PollutionData(BaseModel):
    latitude: float
    longitude: float
    pollution_index: float
    pollution_risk: str
    pollution_status: str

class HabitatChangeData(BaseModel):
    latitude: float
    longitude: float
    habitat_change_percent: float
    change_status: str
    habitat_health: str

class CoastalChangeData(BaseModel):
    latitude: float
    longitude: float
    coastal_change_percent: float
    coastal_change_status: str
    coastal_condition: str

class EcosystemHealthData(BaseModel):
    latitude: float
    longitude: float
    ecosystem_health_score: float
    ecosystem_health_status: str

class RiskAssessmentData(BaseModel):
    latitude: float
    longitude: float
    overall_risk: str
    environmental_risk: str
    pollution_risk: str
    habitat_risk: str
    coastal_risk: str
    biodiversity_risk: str

class RestorationPriorityData(BaseModel):
    latitude: float
    longitude: float
    restoration_priority: str
    habitat_priority: str
    pollution_priority: str
    biodiversity_priority: str
    coastal_priority: str


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():
    return {
        "message": "OceanTwin-AI API is running",
        "status": "online"
    }


# ============================================================
# HEALTH CHECK
# ============================================================

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "model_loaded": sst_model is not None,
        "sst_data_loaded": sst_data is not None
    }


# ============================================================
# OCEAN STATUS
# ============================================================

@app.get("/api/ocean-status")
def ocean_status():
    return {
        "temperature": 28.4,
        "salinity": 36.2,
        "wave_height": 1.8,
        "water_quality": "Good",
        "biodiversity": 82,
        "pollution_risk": "Low"
    }


# ============================================================
# OLD DEMO PREDICTION ENDPOINT
# ============================================================

@app.get("/api/predict")
def predict():
    """
    Legacy/demo prediction endpoint.

    The actual SST ML model is available through:
    /api/predict-sst
    """

    return {
        "prediction": {
            "risk_level": "Low",
            "confidence": 0.87,
            "message": "Current environmental conditions indicate low ecological risk."
        },
        "model_status": "demo"
    }


# ============================================================
# TRAINED SST PREDICTION
# ============================================================

@app.post("/api/predict-sst")
def predict_sst(request: SSTPredictionRequest):

    # --------------------------------------------------------
    # Check model
    # --------------------------------------------------------

    if sst_model is None:
        raise HTTPException(
            status_code=500,
            detail="SST prediction model is not loaded."
        )

    # --------------------------------------------------------
    # Validate geographic region
    #
    # Current prototype region:
    # Latitude: 5°N to 20°N
    # Longitude: 60°E to 75°E
    # --------------------------------------------------------

    if not (5 <= request.latitude <= 20):
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between 5 and 20 degrees."
        )

    if not (60 <= request.longitude <= 75):
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between 60 and 75 degrees."
        )

    # --------------------------------------------------------
    # Validate date features
    # --------------------------------------------------------

    if not (1 <= request.day_of_year <= 366):
        raise HTTPException(
            status_code=400,
            detail="day_of_year must be between 1 and 366."
        )

    if not (1 <= request.month <= 12):
        raise HTTPException(
            status_code=400,
            detail="month must be between 1 and 12."
        )

    # --------------------------------------------------------
    # Create model input
    # --------------------------------------------------------

    input_data = pd.DataFrame([
        {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "day_of_year": request.day_of_year,
            "month": request.month,
            "sst_today": request.sst_today
        }
    ])

    # --------------------------------------------------------
    # Predict
    # --------------------------------------------------------

    prediction = sst_model.predict(input_data)

    predicted_sst = float(prediction[0])

    # --------------------------------------------------------
    # Calculate change
    # --------------------------------------------------------

    sst_change = predicted_sst - request.sst_today

    return {
        "prediction": {
            "latitude": request.latitude,
            "longitude": request.longitude,
            "sst_today": round(request.sst_today, 3),
            "predicted_sst_tomorrow": round(predicted_sst, 3),
            "sst_change": round(sst_change, 3),
            "unit": "°C"
        },
        "model_status": "trained"
    }


# ============================================================
# GET NASA SST FOR LOCATION AND DATE
# ============================================================

@app.post("/api/get-sst")
def get_sst(request: SSTRequest):

    # --------------------------------------------------------
    # Check dataset
    # --------------------------------------------------------

    if sst_data is None:
        raise HTTPException(
            status_code=500,
            detail="NASA SST dataset is not loaded."
        )

    # --------------------------------------------------------
    # Validate region
    # --------------------------------------------------------

    if not (5 <= request.latitude <= 20):
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between 5 and 20 degrees."
        )

    if not (60 <= request.longitude <= 75):
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between 60 and 75 degrees."
        )

    # --------------------------------------------------------
    # Parse requested date
    # --------------------------------------------------------

    try:
        requested_date = pd.to_datetime(request.date)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    # --------------------------------------------------------
    # Filter by date
    # --------------------------------------------------------

    date_data = sst_data[
        sst_data["date"].dt.date == requested_date.date()
    ]

    if date_data.empty:
        raise HTTPException(
            status_code=404,
            detail=f"No SST data available for {request.date}."
        )

    # --------------------------------------------------------
    # Find nearest NASA grid point
    # --------------------------------------------------------

    distances = (
        (date_data["latitude"] - request.latitude) ** 2
        +
        (date_data["longitude"] - request.longitude) ** 2
    )

    nearest_index = distances.idxmin()

    nearest_row = date_data.loc[nearest_index]

    # --------------------------------------------------------
    # Return result
    # --------------------------------------------------------

    return {
        "location": {
            "requested_latitude": request.latitude,
            "requested_longitude": request.longitude,
            "actual_latitude": float(nearest_row["latitude"]),
            "actual_longitude": float(nearest_row["longitude"])
        },
        "date": request.date,
        "sst_celsius": round(float(nearest_row["sst_celsius"]), 3),
        "data_source": "NASA MUR SST v4.2"
    }


# ============================================================
# SST MONTHLY TREND
# ============================================================

@app.get("/api/sst-trend")
def get_sst_trend():

    # --------------------------------------------------------
    # Check dataset
    # --------------------------------------------------------

    if sst_data is None:
        raise HTTPException(
            status_code=500,
            detail="NASA SST dataset is not loaded."
        )

    try:

        # ----------------------------------------------------
        # Make a copy
        # ----------------------------------------------------

        data = sst_data.copy()

        # ----------------------------------------------------
        # Make sure date is datetime
        # ----------------------------------------------------

        data["date"] = pd.to_datetime(data["date"])

        # ----------------------------------------------------
        # Calculate monthly mean SST
        # ----------------------------------------------------

        monthly = (
            data
            .groupby(data["date"].dt.month)["sst_celsius"]
            .mean()
            .reset_index()
        )

        # Rename columns
        monthly.columns = [
            "month_number",
            "sst"
        ]

        # ----------------------------------------------------
        # Month names
        # ----------------------------------------------------

        month_names = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]

        # ----------------------------------------------------
        # Add month name
        # ----------------------------------------------------

        monthly["month"] = monthly["month_number"].apply(
            lambda x: month_names[int(x) - 1]
        )

        # ----------------------------------------------------
        # Round SST values
        # ----------------------------------------------------

        monthly["sst"] = monthly["sst"].round(3)

        # ----------------------------------------------------
        # Return response
        # ----------------------------------------------------

        return {
            "year": 2020,
            "region": "Arabian Sea",
            "data_source": "NASA MUR SST v4.2",
            "unit": "°C",
            "trend": monthly[
                [
                    "month",
                    "month_number",
                    "sst"
                ]
            ].to_dict(orient="records")
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Could not calculate SST trend: {str(e)}"
        )


# ============================================================
# RUN INFORMATION
# ============================================================

@app.get("/api/info")
def api_info():
    return {
        "project": "OceanTwin-AI",
        "description": "Digital Twin Platform for Coastal Ecosystems",
        "current_module": "Sea Surface Temperature",
        "region": {
            "name": "Arabian Sea",
            "latitude": "5°N - 20°N",
            "longitude": "60°E - 75°E"
        },
        "data": {
            "source": "NASA MUR SST v4.2",
            "year": 2020,
            "unit": "°C"
        },
        "machine_learning": {
            "model": "Next-day SST prediction",
            "status": "trained" if sst_model is not None else "not_loaded"
        }
    }

# ============================================================
# WATER QUALITY
# ============================================================

@app.get("/api/water-quality")
def get_water_quality(
    latitude: float = 12.625,
    longitude: float = 63.125,
    date: str = "2020-10-01"
):

    # --------------------------------------------------------
    # Validate OceanTwin prototype region
    # --------------------------------------------------------

    if not (5 <= latitude <= 20):
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between 5 and 20 degrees."
        )

    if not (60 <= longitude <= 75):
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between 60 and 75 degrees."
        )

    # --------------------------------------------------------
    # Validate date
    # --------------------------------------------------------

    try:
        requested_date = pd.to_datetime(date)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    # --------------------------------------------------------
    # Prototype values
    #
    # These are NOT real measurements yet.
    # They will be replaced with actual water-quality
    # datasets/models later.
    # --------------------------------------------------------

    temperature = 28.4
    ph = 8.1
    dissolved_oxygen = 6.8
    turbidity = 3.2

    # --------------------------------------------------------
    # Return location-aware response
    # --------------------------------------------------------

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": requested_date.strftime("%Y-%m-%d"),

        "parameters": {
            "temperature": {
                "value": temperature,
                "unit": "°C"
            },
            "ph": {
                "value": ph,
                "unit": ""
            },
            "dissolved_oxygen": {
                "value": dissolved_oxygen,
                "unit": "mg/L"
            },
            "turbidity": {
                "value": turbidity,
                "unit": "NTU"
            }
        },

        "quality_status": "Good"
    }

# ============================================================
# BIODIVERSITY
# ============================================================

@app.get("/api/biodiversity")
def get_biodiversity(
    latitude: float = 12.625,
    longitude: float = 63.125,
    date: str = "2020-10-01"
):

    # --------------------------------------------------------
    # Validate OceanTwin prototype region
    # --------------------------------------------------------

    if not (5 <= latitude <= 20):
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between 5 and 20 degrees."
        )

    if not (60 <= longitude <= 75):
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between 60 and 75 degrees."
        )

    # --------------------------------------------------------
    # Validate date
    # --------------------------------------------------------

    try:
        requested_date = pd.to_datetime(date)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    # --------------------------------------------------------
    # Prototype biodiversity values
    #
    # These are NOT real biodiversity measurements yet.
    # They are being used to build and test the
    # OceanTwin-AI biodiversity module.
    # --------------------------------------------------------

    species_richness = 72
    biodiversity_score = 82
    habitat_diversity = 3.4

    # --------------------------------------------------------
    # Return location-aware response
    # --------------------------------------------------------

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": requested_date.strftime("%Y-%m-%d"),

        "indicators": {
            "species_richness": {
                "value": species_richness,
                "unit": "index"
            },

            "biodiversity_score": {
                "value": biodiversity_score,
                "unit": "score"
            },

            "habitat_diversity": {
                "value": habitat_diversity,
                "unit": "index"
            }
        },

        "biodiversity_status": "Good"
    }


# ============================================================
# POLLUTION
# ============================================================

@app.get("/api/pollution")
def get_pollution(
    latitude: float = 12.625,
    longitude: float = 63.125,
    date: str = "2020-10-01"
):

    # --------------------------------------------------------
    # Validate OceanTwin prototype region
    # --------------------------------------------------------

    if not (5 <= latitude <= 20):
        raise HTTPException(
            status_code=400,
            detail="Latitude must be between 5 and 20 degrees."
        )

    if not (60 <= longitude <= 75):
        raise HTTPException(
            status_code=400,
            detail="Longitude must be between 60 and 75 degrees."
        )

    # --------------------------------------------------------
    # Validate date
    # --------------------------------------------------------

    try:
        requested_date = pd.to_datetime(date)

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid date format. Use YYYY-MM-DD."
        )

    # --------------------------------------------------------
    # Prototype pollution values
    #
    # These are NOT real pollution measurements yet.
    # They are being used to build and test the
    # OceanTwin-AI pollution module.
    # --------------------------------------------------------

    pollution_index = 24
    pollution_risk = "Low"
    pollution_status = "Good"

    # --------------------------------------------------------
    # Return location-aware response
    # --------------------------------------------------------

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": requested_date.strftime("%Y-%m-%d"),

        "indicators": {
            "pollution_index": {
                "value": pollution_index,
                "unit": "index"
            }
        },

        "pollution_risk": pollution_risk,
        "pollution_status": pollution_status
    }

@app.get("/api/habitat-change")
def get_habitat_change(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Prototype habitat / mangrove change endpoint.

    These values are currently prototype values and are not
    derived from satellite change-detection analysis yet.
    """

    # Validate the prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    # Prototype values
    habitat_change_percent = 3.8
    change_status = "Stable"
    habitat_health = "Good"

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "indicators": {
            "habitat_change_percent": {
                "value": habitat_change_percent,
                "unit": "%"
            },
            "change_status": {
                "value": change_status
            },
            "habitat_health": {
                "value": habitat_health
            }
        },

        "habitat_change_status": change_status,
        "habitat_health": habitat_health
    }

@app.get("/api/coastal-change")
def get_coastal_change(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Prototype coastal-change endpoint.

    These values are currently prototype values and are not
    derived from satellite shoreline-change analysis yet.
    """

    # Validate the prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    # Prototype values
    coastal_change_percent = 2.6
    coastal_change_status = "Stable"
    coastal_condition = "Good"

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "indicators": {
            "coastal_change_percent": {
                "value": coastal_change_percent,
                "unit": "%"
            },
            "coastal_change_status": {
                "value": coastal_change_status
            },
            "coastal_condition": {
                "value": coastal_condition
            }
        },

        "coastal_change_status": coastal_change_status,
        "coastal_condition": coastal_condition
    }

@app.get("/api/ecosystem-health")
def get_ecosystem_health(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Prototype ecosystem health endpoint.

    The current score is a prototype composite indicator.
    It is not a scientifically validated ecosystem-health
    assessment yet.
    """

    # Validate the prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    # --------------------------------------------------
    # PROTOTYPE COMPONENT SCORES
    # --------------------------------------------------

    water_quality_score = 85
    biodiversity_score = 82
    habitat_health_score = 85
    pollution_score = 76
    coastal_condition_score = 85

    # --------------------------------------------------
    # PROTOTYPE WEIGHTED HEALTH SCORE
    # --------------------------------------------------

    ecosystem_health_score = round(
        (
            water_quality_score * 0.20
            + biodiversity_score * 0.25
            + habitat_health_score * 0.25
            + pollution_score * 0.15
            + coastal_condition_score * 0.15
        ),
        1
    )

    # Determine prototype status
    if ecosystem_health_score >= 75:
        ecosystem_health_status = "Good"
    elif ecosystem_health_score >= 50:
        ecosystem_health_status = "Moderate"
    else:
        ecosystem_health_status = "Poor"

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "ecosystem_health": {
            "score": ecosystem_health_score,
            "unit": "score",
            "status": ecosystem_health_status
        },

        "components": {
            "water_quality": {
                "score": water_quality_score,
                "weight": 0.20
            },
            "biodiversity": {
                "score": biodiversity_score,
                "weight": 0.25
            },
            "habitat_health": {
                "score": habitat_health_score,
                "weight": 0.25
            },
            "pollution": {
                "score": pollution_score,
                "weight": 0.15
            },
            "coastal_condition": {
                "score": coastal_condition_score,
                "weight": 0.15
            }
        },

        "ecosystem_health_score": ecosystem_health_score,
        "ecosystem_health_status": ecosystem_health_status
    }


@app.get("/api/risk-assessment")
def get_risk_assessment(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Prototype ecosystem risk-assessment endpoint.

    These risk categories are currently prototype outputs.
    They are not yet generated by a validated risk model.
    """

    # Validate the prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    # --------------------------------------------------
    # PROTOTYPE RISK CATEGORIES
    # --------------------------------------------------

    environmental_risk = "Low"
    pollution_risk = "Low"
    habitat_risk = "Low"
    coastal_risk = "Low"
    biodiversity_risk = "Low"

    # Overall prototype risk
    overall_risk = "Low"

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "risk_assessment": {
            "overall_risk": overall_risk,
            "environmental_risk": environmental_risk,
            "pollution_risk": pollution_risk,
            "habitat_risk": habitat_risk,
            "coastal_risk": coastal_risk,
            "biodiversity_risk": biodiversity_risk
        },

        "overall_risk": overall_risk,
        "environmental_risk": environmental_risk,
        "pollution_risk": pollution_risk,
        "habitat_risk": habitat_risk,
        "coastal_risk": coastal_risk,
        "biodiversity_risk": biodiversity_risk
    }


@app.get("/api/restoration-priority")
def get_restoration_priority(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Prototype restoration-priority endpoint.

    This is currently a rule-based prototype decision-support
    indicator and is not a validated restoration-planning model.
    """

    # Validate the prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    # --------------------------------------------------
    # PROTOTYPE PRIORITY INDICATORS
    # --------------------------------------------------

    habitat_priority = "Medium"
    pollution_priority = "Low"
    biodiversity_priority = "Medium"
    coastal_priority = "Low"

    # Overall prototype restoration priority
    restoration_priority = "Medium"

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "restoration_assessment": {
            "restoration_priority": restoration_priority,
            "habitat_priority": habitat_priority,
            "pollution_priority": pollution_priority,
            "biodiversity_priority": biodiversity_priority,
            "coastal_priority": coastal_priority
        },

        "restoration_priority": restoration_priority,
        "habitat_priority": habitat_priority,
        "pollution_priority": pollution_priority,
        "biodiversity_priority": biodiversity_priority,
        "coastal_priority": coastal_priority
    }

@app.get("/api/digital-twin-summary")
def get_digital_twin_summary(
    latitude: float,
    longitude: float,
    date: str
):
    """
    Unified prototype Digital Twin summary.

    This endpoint combines the current prototype ecosystem
    indicators into a single GIS-ready response.
    """

    # Validate prototype study region
    if not (5 <= latitude <= 20):
        return {
            "error": "Latitude must be between 5 and 20 degrees."
        }

    if not (60 <= longitude <= 75):
        return {
            "error": "Longitude must be between 60 and 75 degrees."
        }

    return {
        "data_status": "prototype",
        "data_source": "OceanTwin-AI prototype",

        "location": {
            "latitude": latitude,
            "longitude": longitude
        },

        "date": date,

        "layers": {

            "water_quality": {
                "status": "Good",
                "score": 85
            },

            "biodiversity": {
                "status": "Good",
                "score": 82
            },

            "pollution": {
                "status": "Good",
                "risk": "Low",
                "index": 24
            },

            "habitat": {
                "status": "Good",
                "change": 3.8,
                "change_unit": "%"
            },

            "coastal": {
                "status": "Good",
                "change": 2.6,
                "change_unit": "%"
            },

            "ecosystem_health": {
                "status": "Good",
                "score": 82.9
            },

            "ecosystem_risk": {
                "risk": "Low"
            },

            "restoration": {
                "priority": "Medium"
            }
        },

        "digital_twin_status": "Active"
    }