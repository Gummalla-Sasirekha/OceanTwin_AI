import pandas as pd
from pathlib import Path

# --------------------------------------------------
# CREATE NEXT-DAY SST TRAINING DATASET
# --------------------------------------------------

INPUT_FILE = Path(
    "ml/data/raw/NASA_MUR_SST_2020_ArabianSea.csv"
)

OUTPUT_FILE = Path(
    "ml/data/raw/NASA_MUR_SST_training.csv"
)

print("Loading NASA SST dataset...")

df = pd.read_csv(
    INPUT_FILE,
    parse_dates=["date"]
)

print(f"Original rows: {len(df)}")

# --------------------------------------------------
# Keep only dates inside 2020
# --------------------------------------------------

df = df[
    (df["date"] >= "2020-01-01") &
    (df["date"] < "2021-01-01")
].copy()

# --------------------------------------------------
# Sort by location and time
# --------------------------------------------------

df = df.sort_values(
    ["latitude", "longitude", "date"]
).reset_index(drop=True)

# --------------------------------------------------
# Create tomorrow's SST
# --------------------------------------------------

df["sst_tomorrow"] = (
    df.groupby(["latitude", "longitude"])["sst_celsius"]
    .shift(-1)
)

# Create tomorrow's date
df["tomorrow_date"] = (
    df.groupby(["latitude", "longitude"])["date"]
    .shift(-1)
)

# --------------------------------------------------
# Make sure tomorrow is actually the next day
# --------------------------------------------------

df["days_difference"] = (
    df["tomorrow_date"] - df["date"]
).dt.days

df = df[
    df["days_difference"] == 1
].copy()

# --------------------------------------------------
# Create useful time features
# --------------------------------------------------

df["day_of_year"] = df["date"].dt.dayofyear

df["month"] = df["date"].dt.month

# --------------------------------------------------
# Keep only ML columns
# --------------------------------------------------

training_df = df[
    [
        "date",
        "latitude",
        "longitude",
        "day_of_year",
        "month",
        "sst_celsius",
        "sst_tomorrow"
    ]
].copy()

# Rename today's SST
training_df = training_df.rename(
    columns={
        "sst_celsius": "sst_today"
    }
)

# Remove any remaining missing values
training_df = training_df.dropna()

# --------------------------------------------------
# Save training dataset
# --------------------------------------------------

training_df.to_csv(
    OUTPUT_FILE,
    index=False
)

# --------------------------------------------------
# Display results
# --------------------------------------------------

print("\n===== TRAINING DATASET CREATED =====")

print(f"Output file: {OUTPUT_FILE}")
print(f"Rows: {len(training_df)}")

print("\n===== COLUMNS =====")
print(list(training_df.columns))

print("\n===== FIRST 5 ROWS =====")
print(training_df.head())

print("\n===== LAST 5 ROWS =====")
print(training_df.tail())

print("\n===== SST RANGE =====")
print(
    f"Today's SST: "
    f"{training_df['sst_today'].min():.2f} "
    f"to "
    f"{training_df['sst_today'].max():.2f} °C"
)

print(
    f"Tomorrow's SST: "
    f"{training_df['sst_tomorrow'].min():.2f} "
    f"to "
    f"{training_df['sst_tomorrow'].max():.2f} °C"
)