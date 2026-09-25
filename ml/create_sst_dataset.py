import xarray as xr
import pandas as pd
from pathlib import Path

# --------------------------------------------------
# NASA MUR SST → ML DATASET
# Arabian Sea region
# --------------------------------------------------

INPUT_DIR = Path("ml/data/raw/nasa_mur_2020")
OUTPUT_FILE = Path("ml/data/raw/NASA_MUR_SST_2020_ArabianSea.csv")

# Region
LAT_MIN = 5
LAT_MAX = 20
LON_MIN = 60
LON_MAX = 75

all_data = []

files = sorted(INPUT_DIR.glob("*.nc"))

print(f"Found {len(files)} NASA MUR files.")

for i, file in enumerate(files, start=1):

    print(f"Processing {i}/{len(files)}: {file.name}")

    try:
        dataset = xr.open_dataset(file)

        # Extract Arabian Sea region
        region = dataset.sel(
            lat=slice(LAT_MIN, LAT_MAX),
            lon=slice(LON_MIN, LON_MAX)
        )

        # Convert Kelvin → Celsius
        sst = region["analysed_sst"] - 273.15

        # Convert to DataFrame
        df = sst.to_dataframe(name="sst_celsius").reset_index()

        # Remove missing values
        df = df.dropna(subset=["sst_celsius"])

        # Keep only required columns
        df = df[
            ["time", "lat", "lon", "sst_celsius"]
        ]

        all_data.append(df)

        dataset.close()

    except Exception as e:
        print(f"ERROR processing {file.name}: {e}")


# --------------------------------------------------
# Combine all days
# --------------------------------------------------

print("\nCombining datasets...")

final_df = pd.concat(all_data, ignore_index=True)

# Rename columns
final_df = final_df.rename(
    columns={
        "time": "date",
        "lat": "latitude",
        "lon": "longitude"
    }
)

# Sort by date and location
final_df = final_df.sort_values(
    ["date", "latitude", "longitude"]
)

# Save
final_df.to_csv(
    OUTPUT_FILE,
    index=False
)

print("\n===== DATASET CREATED =====")
print(f"Output: {OUTPUT_FILE}")
print(f"Rows: {len(final_df)}")

print("\n===== DATASET PREVIEW =====")
print(final_df.head())

print("\n===== DATASET INFO =====")
print(final_df.info())

print("\n===== SST STATISTICS =====")
print(f"Minimum SST: {final_df['sst_celsius'].min():.2f} °C")
print(f"Maximum SST: {final_df['sst_celsius'].max():.2f} °C")
print(f"Mean SST: {final_df['sst_celsius'].mean():.2f} °C")