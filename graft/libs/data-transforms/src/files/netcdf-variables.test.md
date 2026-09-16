# libs/data-transforms/src/files/netcdf-variables.test.ts · [[file-format-conversion-pipeline]]

Test suite validating NetCDF file parsing, type detection, and variable extraction for classic, NetCDF4, and HDF5 formats.

- UnidataExample · type · L40-L46 — Type definition describing metadata for a NetCDF example file including its path, size, format type, geospatial status, and list of griddable variables.
- example · function · L53-L59 — Helper function that retrieves a test example file metadata by name from the Unidata examples registry.
- header · function · L66-L72 — Helper function that reads and returns the first N bytes of a test file needed to parse the NetCDF header without loading the entire file into memory.
- asBlob · function · L73-L73 — Test utility that converts a test file name into a Blob containing only the file header bytes.
- asFile · function · L74-L74 — Test utility that converts a test file name into a File object containing only the header bytes.
- asHdf5 · function · L75-L75 — Test utility that opens a test file as an h5wasm File object for HDF5-based parsing.
- hdf5MagicFile · function · L78-L78 — Test utility that creates a minimal File object with HDF5 magic bytes for testing format detection without a full file.
