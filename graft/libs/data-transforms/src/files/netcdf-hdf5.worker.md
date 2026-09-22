# libs/data-transforms/src/files/netcdf-hdf5.worker.ts · [[file-format-conversion-pipeline]] [[web-worker-offloading-for-heavy-i-o]]

- isDataset · function · L11-L12 — Type guard that determines whether an h5wasm Group entry is a Dataset by checking for shape and dtype properties.
- attributeText · function · L15-L19 — Extracts a string attribute value from an HDF5 dataset, normalizing h5wasm's scalar-or-array inconsistency.
- rootDatasets · function · L21-L25 — Collects all Dataset entries from the root group, filtering out non-dataset members.
- isGeospatialHdf5 · function · L28-L35 — Determines whether an HDF5 file is a valid geospatial NetCDF4 by checking for latitude and longitude coordinate axes.
- listGriddableHdf5Variables · function · L37-L44 — Returns names of variables in an HDF5 file that are griddable (2+ dimensions and part of a geospatial dataset).
- resetWorkMount · function · L49-L63 — Unmounts and removes the worker filesystem mount point to clean up after file operations.
- readVariablesFromFile · function · L65-L92 — Opens an HDF5 file via worker filesystem mount, extracts griddable variables, and cleans up resources.
