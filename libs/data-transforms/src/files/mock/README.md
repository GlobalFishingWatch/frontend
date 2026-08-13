# GeoTIFF sample data

## `gfw-azores.tif`

125x40 single-band Float32 raster covering the Azores, EPSG:4326 (`GeographicTypeGeoKey: 4326`),
nodata `-3.4e+38`.

- **Source:** <https://github.com/GeoTIFF/test-data/blob/master/files/gfw-azores.tif>, described in
  that repo's README as a "Global Fishing Watch derived dataset that covers The Azores".
- **Origin / licence:** Global Fishing Watch — see
  <https://globalfishingwatch.org/datasets-and-code/>.

Used by `../geotiff-to-list.test.ts` to exercise `geotiffToList` against a real GDAL-authored
file rather than only against rasters synthesised in the test.

## `GeogToWGS84GeoKey5.tif`

101x101 raster with a **user-defined** geographic CRS (`GeographicTypeGeoKey: 32767`, plus a
`GeogTOWGS84GeoKey` datum shift) — i.e. geographic but not WGS 84, so `geotiffToList` has to resolve a CRS for it rather than passing the coordinates straight through.

- **Source:** <https://github.com/GeoTIFF/test-data/blob/master/files/GeogToWGS84GeoKey5.tif>,
  attributed in that repo's README to the OSGEO sample set,
  <https://download.osgeo.org/geotiff/samples/GeogToWGS84GeoKey/>.

Projected CRSs (`ProjectedCSTypeGeoKey`) are covered by rasters synthesised in the test — no
equally small, clearly-licensed projected sample was to hand.
