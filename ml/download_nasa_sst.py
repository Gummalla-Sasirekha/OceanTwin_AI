import earthaccess
from pathlib import Path

# --------------------------------------------------
# NASA MUR SST v4.2
# Arabian Sea region
# 2020
# --------------------------------------------------

OUTPUT_DIR = Path("ml/data/raw/nasa_mur_2020")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

print("Logging into NASA Earthdata...")

earthaccess.login()

print("Searching NASA MUR SST data...")

results = earthaccess.search_data(
    short_name="MUR25-JPL-L4-GLOB-v04.2",
    temporal=("2020-01-01", "2020-12-31"),
    bounding_box=(60, 5, 75, 20),
)

print(f"Found {len(results)} files.")

print("Starting download...")
print(f"Download folder: {OUTPUT_DIR}")

files = earthaccess.download(
    results,
    local_path=str(OUTPUT_DIR)
)

print("\n===== DOWNLOAD COMPLETE =====")
print(f"Files downloaded: {len(files)}")
print(f"Location: {OUTPUT_DIR}")