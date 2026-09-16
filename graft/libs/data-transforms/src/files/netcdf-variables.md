# libs/data-transforms/src/files/netcdf-variables.ts · [[defensive-parsing-and-error-normalization]] [[file-format-conversion-pipeline]] [[web-worker-offloading-for-heavy-i-o]]

- NetcdfType · type · L6-L6 — Enumerates the supported NetCDF file format types: netcdf3, hdf5, or unknown.
- NetcdfError · type · L7-L7 — Defines the union type of NetCDF error constants for invalid data scenarios.
- GeoAxis · type · L27-L27 — Enumerates the two geographic axes that NetCDF coordinate variables can represent: latitude or longitude.
- NetcdfCoordinate · type · L28-L28 — Describes a NetCDF coordinate variable with its name, units, and optional CF standard name for axis identification.
- geoAxisOf · function · L31-L43 — Classifies a coordinate as latitude or longitude by testing its units and standard name against CF conventions and fallback name patterns.
- hasLatLonCoordinates · function · L49-L52 — Validates that a set of coordinates contains both latitude and longitude axes required for map projection.
- startsWith · function · L54-L55 — Checks if a byte array begins with a given magic number sequence.
- netcdfMagicFromBytes · function · L57-L65 — Determines the NetCDF file type by comparing the leading bytes against known format signatures.
- readNetcdfType · function · L67-L70 — Asynchronously identifies a NetCDF file's format type by reading and analyzing its magic header bytes.
- attributeText · function · L72-L77 — Extracts the string value of a named attribute from a NetCDF variable's attribute list.
- netcdf3Coordinates · function · L80-L87 — Transforms NetCDF3 variables into coordinate metadata objects by extracting name, units, and standard name for axis classification.
- Netcdf3Variable · type · L89-L89 — Represents a NetCDF3 variable with its name, dimension indices, and attributes.
- readNetcdf3Header · function · L92-L106 — Parses the NetCDF3 file header by trying progressively larger byte prefixes to extract variable definitions, avoiding full file loads when possible.
- getNetcdf3Variables · function · L108-L116 — Extracts the names of griddable variables from a NetCDF3 file after validating it contains both latitude and longitude coordinates.
- rejectInvalidNetcdf · function · L118-L120 — Throws a standardized NetCDF error with an underlying cause, used for error handling and mapping.
- getNetcdfVariables · function · L128-L159 — Extracts griddable variable names from either NetCDF3 or NetCDF4 (HDF5) files, routing to appropriate handler and validating results.
