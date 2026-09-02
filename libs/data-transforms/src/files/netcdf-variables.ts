// Attaches the jsfive declarations to every program that compiles this file. Apps reach
// lib source through the `development` export condition, and that pulls in files by import
// resolution only — an ambient .d.ts sitting in src is never loaded, so an `import` cannot
// replace this and platform:typecheck fails with TS7016 without it.
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./jsfive.d.ts" />

/** Thrown as the error message — consumers map these to their own user-facing copy. */
export const NETCDF_ERRORS = {
  InvalidData: 'INVALID_NETCDF_DATA',
} as const

export type NetcdfError = (typeof NETCDF_ERRORS)[keyof typeof NETCDF_ERRORS]

/** NetCDF3 classic and 64-bit offset both open with "CDF" followed by a version byte */
const NETCDF3_MAGIC = [0x43, 0x44, 0x46]
/** NetCDF4 is HDF5, whose signature opens with \x89HDF */
const HDF5_MAGIC = [0x89, 0x48, 0x44, 0x46]

/** A griddable variable spans at least latitude and longitude, so 1-D coordinates are out */
const MIN_DIMENSIONS = 2

/** Headers run a few KB in practice, so the first prefix almost always wins */
const NETCDF3_PREFIX_SIZES = [64 * 1024, 1024 * 1024, 16 * 1024 * 1024]

const startsWith = (bytes: Uint8Array, magic: number[]) =>
  magic.every((byte, index) => bytes[index] === byte)

async function getNetcdf3Variables(file: Blob) {
  const { NetCDFReader } = await import('netcdfjs')
  const readVariables = (buffer: ArrayBuffer) =>
    new NetCDFReader(buffer).variables
      // dimensions holds dimension ids, not names — only its length matters here
      .filter((variable) => variable.dimensions.length >= MIN_DIMENSIONS)
      .map((variable) => variable.name)

  // NetCDFReader parses sequentially from byte 0 and stops at the end of the header, never
  // touching the data, so a prefix is enough. A prefix that cuts the header short throws —
  // iobuffer reads scalars through DataView — rather than misparsing, so grow and retry.
  for (const size of NETCDF3_PREFIX_SIZES) {
    if (size >= file.size) {
      break
    }
    try {
      return readVariables(await file.slice(0, size).arrayBuffer())
    } catch {
      // header runs past this prefix
    }
  }
  return readVariables(await file.arrayBuffer())
}

async function getHdf5Variables(file: Blob) {
  const { Dataset, File } = await import('jsfive')
  // ponytail: the whole file, in one ArrayBuffer. jsfive maps a single DataView over it and
  // seeks absolute addresses out of the object headers, so a prefix cannot work — unlike the
  // NetCDF3 branch above. hdf5-indexed-reader (a jsfive fork that range-reads a Blob) is the
  // obvious upgrade and was tried on 2026-09-02, but 1.0.1 cannot list links stored as link
  // messages, which is exactly how NetCDF4 writes its root group: `_get_link_from_link_msg`
  // does `await this._decode_link_msg(...)[1]` instead of `(await ...)[1]`, so every link
  // comes back undefined. Revisit if that lands upstream.
  const root = new File(await file.arrayBuffer())
  // ponytail: root group only. Variables nested in NetCDF4 groups would need a recursive walk
  // and a slash-joined path, which the API's `variable` field may not accept
  return root.keys.filter((key) => {
    const entry = root.get(key)
    return entry instanceof Dataset && entry.shape.length >= MIN_DIMENSIONS
  })
}

/**
 * Names of the griddable variables in a NetCDF file, in file order.
 *
 * NetCDF3 and NetCDF4 are unrelated on disk — NetCDF4 is HDF5 — and no single library reads
 * both, so the leading magic bytes pick the reader. NetCDF3 needs only a prefix; HDF5 needs
 * the whole file.
 */
export async function getNetcdfVariables(file: Blob): Promise<string[]> {
  try {
    const magic = new Uint8Array(await file.slice(0, HDF5_MAGIC.length).arrayBuffer())
    const variables = startsWith(magic, NETCDF3_MAGIC)
      ? await getNetcdf3Variables(file)
      : startsWith(magic, HDF5_MAGIC)
        ? await getHdf5Variables(file)
        : []
    if (!variables.length) {
      throw new Error(NETCDF_ERRORS.InvalidData)
    }
    return variables
  } catch (e) {
    throw new Error(NETCDF_ERRORS.InvalidData, { cause: e })
  }
}
