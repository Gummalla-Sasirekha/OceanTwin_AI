import xarray as xr

file_path = "ml/data/raw/NASA_MUR_SST_sample.nc"

dataset = xr.open_dataset(file_path)

print("\n===== NASA MUR SST DATASET =====")
print(dataset)

print("\n===== VARIABLES =====")
print(list(dataset.data_vars))

print("\n===== COORDINATES =====")
print(list(dataset.coords))

dataset.close()