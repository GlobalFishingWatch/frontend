/** Thrown as the error message — consumers map these to their own user-facing copy. */
export const NETCDF_ERRORS = {
  InvalidData: 'INVALID_NETCDF_DATA',
} as const

export type NetcdfType = 'netcdf3' | 'hdf5' | 'unknown'
export type NetcdfError = (typeof NETCDF_ERRORS)[keyof typeof NETCDF_ERRORS]

/** NetCDF3 classic and 64-bit offset both open with "CDF" followed by a version byte */
export const NETCDF3_MAGIC = [0x43, 0x44, 0x46] as const
/** NetCDF4 is HDF5, whose signature opens with \x89HDF */
export const HDF5_MAGIC = [0x89, 0x48, 0x44, 0x46] as const

/** A griddable variable spans at least latitude and longitude, so 1-D coordinates are out */
const MIN_DIMENSIONS = 2

/** Headers run a few KB in practice, so the first prefix almost always wins */
const NETCDF3_PREFIX_SIZES = [64 * 1024, 1024 * 1024, 16 * 1024 * 1024] as const

/** CF units for each axis. Files in the wild also spell them `degree_north`, `degrees_N`, `degreeE` */
const LATITUDE_UNITS = /^degrees?_?n(orth)?$/i
const LONGITUDE_UNITS = /^degrees?_?e(ast)?$/i
/** Fallback for files whose axes carry a bare `degrees` unit, e.g. the Unidata GLASS sounding */
const LATITUDE_NAMES = /^(x?lat(itude)?|nav_lat|sta_?lat)$/i
const LONGITUDE_NAMES = /^(x?lon(g|gitude)?|nav_lon|sta_?lon)$/i

export type GeoAxis = 'latitude' | 'longitude'
export type NetcdfCoordinate = { name: string; units?: string; standardName?: string }

/** Which geographic axis a variable describes, by CF units, CF standard name, then name. */
export function geoAxisOf({
  name,
  units = '',
  standardName,
}: NetcdfCoordinate): GeoAxis | undefined {
  if (LATITUDE_UNITS.test(units) || standardName === 'latitude' || LATITUDE_NAMES.test(name)) {
    return 'latitude'
  }
  if (LONGITUDE_UNITS.test(units) || standardName === 'longitude' || LONGITUDE_NAMES.test(name)) {
    return 'longitude'
  }
  return undefined
}

/**
 * A NetCDF grid is only placeable on a map when both axes exist as variables of their own.
 * Projected files that carry the georeference in global attributes only are out
 */
export function hasLatLonCoordinates(coordinates: NetcdfCoordinate[]): boolean {
  const axes = new Set(coordinates.map(geoAxisOf))
  return axes.has('latitude') && axes.has('longitude')
}

const startsWith = (bytes: Uint8Array, magic: readonly number[]): boolean =>
  magic.every((byte, index) => bytes[index] === byte)

export function netcdfMagicFromBytes(magic: Uint8Array): NetcdfType {
  if (startsWith(magic, NETCDF3_MAGIC)) {
    return 'netcdf3'
  }
  if (startsWith(magic, HDF5_MAGIC)) {
    return 'hdf5'
  }
  return 'unknown'
}

export async function readNetcdfType(file: Blob): Promise<NetcdfType> {
  const magic = new Uint8Array(await file.slice(0, HDF5_MAGIC.length).arrayBuffer())
  return netcdfMagicFromBytes(magic)
}

const attributeText = (attributes: unknown, name: string): string | undefined => {
  const value = (attributes as { name: string; value: unknown }[]).find(
    (attribute) => attribute.name === name
  )?.value
  return typeof value === 'string' ? value : undefined
}

/** Every NetCDF3 variable read as a coordinate candidate, for {@link hasLatLonCoordinates} */
export const netcdf3Coordinates = (
  variables: { name: string; attributes: unknown }[]
): NetcdfCoordinate[] =>
  variables.map(({ name, attributes }) => ({
    name,
    units: attributeText(attributes, 'units'),
    standardName: attributeText(attributes, 'standard_name'),
  }))

type Netcdf3Variable = { name: string; dimensions: number[]; attributes: unknown }

/** Variables declared in the smallest header prefix the reader accepts. */
async function readNetcdf3Header(file: Blob): Promise<Netcdf3Variable[]> {
  const { NetCDFReader } = await import('netcdfjs')

  for (const size of NETCDF3_PREFIX_SIZES) {
    if (size >= file.size) {
      break
    }
    try {
      return new NetCDFReader(await file.slice(0, size).arrayBuffer()).variables
    } catch {
      // header runs past this prefix
    }
  }
  return new NetCDFReader(await file.arrayBuffer()).variables
}

export async function getNetcdf3Variables(file: Blob): Promise<string[]> {
  const variables = await readNetcdf3Header(file)
  if (!hasLatLonCoordinates(netcdf3Coordinates(variables))) {
    return []
  }
  return variables
    .filter((variable) => variable.dimensions.length >= MIN_DIMENSIONS)
    .map((variable) => variable.name)
}

function rejectInvalidNetcdf(cause: unknown): never {
  throw new Error(NETCDF_ERRORS.InvalidData, { cause })
}

/**
 * Names of the griddable variables in a NetCDF file, in file order.
 *
 * NetCDF3 reads a header prefix only. NetCDF4 (HDF5) opens the File read-only on WORKERFS in a
 * Web Worker — never loads the whole blob into main-thread memory.
 */
export async function getNetcdfVariables(file: Blob): Promise<string[]> {
  try {
    if (!(file instanceof File)) {
      rejectInvalidNetcdf(new Error('NetCDF file requires a File to extract the variables'))
    }
    const type = await readNetcdfType(file)
    if (type === 'netcdf3') {
      const variables = await getNetcdf3Variables(file)
      if (!variables.length) {
        rejectInvalidNetcdf(new Error('no griddable variables'))
      }
      return variables
    }
    if (type === 'hdf5') {
      if (typeof Worker === 'undefined') {
        rejectInvalidNetcdf(new Error('NetCDF4 requires a browser environment'))
      }
      const { getNetcdf4VariablesFromFile } = await import('./netcdf-hdf5.worker.client')
      const variables = await getNetcdf4VariablesFromFile(file)
      if (!variables.length) {
        rejectInvalidNetcdf(new Error('no griddable variables'))
      }
      return variables
    }
    rejectInvalidNetcdf(new Error('Unrecognized NetCDF file type'))
  } catch (e) {
    if (e instanceof Error && e.message === NETCDF_ERRORS.InvalidData) {
      throw e
    }
    rejectInvalidNetcdf(e)
  }
}
