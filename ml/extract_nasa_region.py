import xarray as xr
import pandas as pd

file_path = "ml/data/raw/NASA_MUR_SST_sample.nc"

dataset = xr.open_dataset(file_path)

# Select Arabian Sea region
region = dataset.sel(
    lat=slice(5, 20),
    lon=slice(60, 75)
)

# Convert SST from Kelvin to Celsius
sst_celsius = region["analysed_sst"] - 273.15

# Convert to a table
df = sst_celsius.to_dataframe(name="sst_celsius").reset_index()

# Remove missing SST values
df = df.dropna(subset=["sst_celsius"])

# Save CSV
output_file = "ml/data/raw/NASA_MUR_SST_sample.csv"
df.to_csv(output_file, index=False)

print("\n===== CSV CREATED =====")
print(f"File: {output_file}")
print(f"Rows: {len(df)}")

print("\n===== FIRST 5 ROWS =====")
print(df.head())

dataset.close()