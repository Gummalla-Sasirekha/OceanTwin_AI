import pandas as pd
import joblib

from pathlib import Path
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


# --------------------------------------------------
# PATHS
# --------------------------------------------------

INPUT_FILE = Path(
    "ml/data/raw/NASA_MUR_SST_training.csv"
)

MODEL_FILE = Path(
    "ml/models/sst_next_day_model.pkl"
)


# --------------------------------------------------
# LOAD DATA
# --------------------------------------------------

print("Loading training dataset...")

df = pd.read_csv(
    INPUT_FILE,
    parse_dates=["date"]
)

print(f"Total rows: {len(df)}")


# --------------------------------------------------
# SORT BY DATE
# --------------------------------------------------

df = df.sort_values("date").reset_index(drop=True)


# --------------------------------------------------
# FEATURES AND TARGET
# --------------------------------------------------

features = [
    "latitude",
    "longitude",
    "day_of_year",
    "month",
    "sst_today"
]

target = "sst_tomorrow"


# --------------------------------------------------
# TIME-BASED TRAIN / TEST SPLIT
# --------------------------------------------------

train_df = df[
    df["date"] < "2020-10-01"
].copy()

test_df = df[
    df["date"] >= "2020-10-01"
].copy()


print("\n===== DATA SPLIT =====")
print(f"Training rows: {len(train_df)}")
print(f"Testing rows:  {len(test_df)}")

print(
    f"Training period: "
    f"{train_df['date'].min()} → {train_df['date'].max()}"
)

print(
    f"Testing period:  "
    f"{test_df['date'].min()} → {test_df['date'].max()}"
)


# --------------------------------------------------
# PREPARE X AND Y
# --------------------------------------------------

X_train = train_df[features]
y_train = train_df[target]

X_test = test_df[features]
y_test = test_df[target]


# --------------------------------------------------
# CREATE MODEL
# --------------------------------------------------

print("\nCreating ML model...")

model = HistGradientBoostingRegressor(
    max_iter=150,
    learning_rate=0.08,
    max_leaf_nodes=31,
    l2_regularization=0.1,
    random_state=42
)


# --------------------------------------------------
# TRAIN
# --------------------------------------------------

print("Training model...")
print("This may take some time...")

model.fit(
    X_train,
    y_train
)

print("Training complete!")


# --------------------------------------------------
# PREDICTION
# --------------------------------------------------

print("\nGenerating predictions...")

predictions = model.predict(X_test)


# --------------------------------------------------
# EVALUATION
# --------------------------------------------------

mae = mean_absolute_error(
    y_test,
    predictions
)

rmse = mean_squared_error(
    y_test,
    predictions
) ** 0.5

r2 = r2_score(
    y_test,
    predictions
)


print("\n===== MODEL PERFORMANCE =====")

print(f"MAE:  {mae:.4f} °C")
print(f"RMSE: {rmse:.4f} °C")
print(f"R²:   {r2:.4f}")


# --------------------------------------------------
# SHOW SAMPLE PREDICTIONS
# --------------------------------------------------

results = test_df[
    ["date", "latitude", "longitude", "sst_today", "sst_tomorrow"]
].copy()

results["predicted_sst"] = predictions

print("\n===== SAMPLE PREDICTIONS =====")

print(
    results.head(10).to_string(index=False)
)


# --------------------------------------------------
# SAVE MODEL
# --------------------------------------------------

MODEL_FILE.parent.mkdir(
    parents=True,
    exist_ok=True
)

joblib.dump(
    model,
    MODEL_FILE
)

print("\n===== MODEL SAVED =====")
print(f"Model: {MODEL_FILE}")