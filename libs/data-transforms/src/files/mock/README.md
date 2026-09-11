# Raster sample data

## `gfw-azores.tif`

125x40 single-band Float32 raster covering the Azores, EPSG:4326 (`GeographicTypeGeoKey: 4326`),
nodata `-3.4e+38`.

- **Source:** <https://github.com/GeoTIFF/test-data/blob/master/files/gfw-azores.tif>, described in
  that repo's README as a "Global Fishing Watch derived dataset that covers The Azores".

Used by `../geotiff-bands.test.ts` to exercise `getGeotiffBandsCount` against a real GDAL-authored
file rather than only against rasters synthesised in the test.

NetCDF fixtures live in [`netcdf/`](./netcdf/) — the Unidata example set, fetched on demand rather than committed.
