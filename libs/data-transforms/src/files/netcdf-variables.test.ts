// @vitest-environment node
import fs from 'fs'
import path from 'path'

import h5wasm from 'h5wasm/node'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { isGeospatialHdf5, listGriddableHdf5Variables } from './netcdf-hdf5.worker'
import { getNetcdf4VariablesFromFile } from './netcdf-hdf5.worker.client'
import type { NetcdfType } from './netcdf-variables'
import {
  geoAxisOf,
  getNetcdf3Variables,
  getNetcdfVariables,
  hasLatLonCoordinates,
  HDF5_MAGIC,
  NETCDF_ERRORS,
  NETCDF3_MAGIC,
  netcdfMagicFromBytes,
  readNetcdfType,
} from './netcdf-variables'

// Worker script registers on import; Node has no addEventListener.
vi.hoisted(() => {
  if (typeof globalThis.addEventListener !== 'function') {
    globalThis.addEventListener = () => undefined
  }
})

vi.mock('./netcdf-hdf5.worker.client', () => ({
  getNetcdf4VariablesFromFile: vi.fn(),
}))

/**
 * Every example on <https://archive.unidata.ucar.edu/software/netcdf/examples/files.html>, pinned
 * to the listing this parser produced when the suite was written. ~780MB, so the data is not
 * committed — run `mock/netcdf/scripts/fetch-unidata-examples.mjs` and the file-backed suites
 * unskip themselves.
 */
type UnidataExample = {
  file: string
  bytes: number
  type: NetcdfType
  geospatial: boolean
  variables: string[]
}

const UNIDATA_DIR = path.join(__dirname, 'mock/netcdf/unidata')
const UNIDATA_EXAMPLES: UnidataExample[] = JSON.parse(
  fs.readFileSync(path.join(UNIDATA_DIR, 'unidata-examples.json'), 'utf8')
).files.filter((example: UnidataExample) => example.file.endsWith('.nc'))

const example = (name: string) => {
  const found = UNIDATA_EXAMPLES.find((candidate) => candidate.file === name)
  if (!found) {
    throw new Error(`${name} is not in unidata-examples.json`)
  }
  return found
}

const downloaded = UNIDATA_EXAMPLES.every(({ file }) =>
  fs.existsSync(path.join(UNIDATA_DIR, file))
)

/** Reading a 281MB example whole would blow the heap — the parser only ever needs the header */
const header = ({ file, bytes }: UnidataExample) => {
  const head = Buffer.alloc(Math.min(16 * 1024 * 1024, bytes))
  const descriptor = fs.openSync(path.join(UNIDATA_DIR, file), 'r')
  fs.readSync(descriptor, head, 0, head.length, 0)
  fs.closeSync(descriptor)
  return head
}
const asBlob = (name: string) => new Blob([header(example(name))])
const asFile = (name: string) => new File([header(example(name))], name)
const asHdf5 = (name: string) => new h5wasm.File(path.join(UNIDATA_DIR, name), 'r')

/** Enough of a file for the magic-byte check; the worker itself is mocked in these tests */
const hdf5MagicFile = () => new File([Uint8Array.of(...HDF5_MAGIC)], 'upload.nc')

afterEach(() => {
  vi.unstubAllGlobals()
  vi.mocked(getNetcdf4VariablesFromFile).mockReset()
})

describe('netcdfMagicFromBytes', () => {
  it('detects classic and 64-bit offset as netcdf3', () => {
    expect(netcdfMagicFromBytes(Uint8Array.of(...NETCDF3_MAGIC, 0x01))).toBe('netcdf3')
    expect(netcdfMagicFromBytes(Uint8Array.of(...NETCDF3_MAGIC, 0x02))).toBe('netcdf3')
  })

  it('detects HDF5', () => {
    expect(netcdfMagicFromBytes(Uint8Array.of(...HDF5_MAGIC))).toBe('hdf5')
  })

  it('returns unknown for anything else', () => {
    expect(netcdfMagicFromBytes(new Uint8Array())).toBe('unknown')
    expect(netcdfMagicFromBytes(Uint8Array.of(0x43, 0x44))).toBe('unknown')
    expect(netcdfMagicFromBytes(new TextEncoder().encode('not netcdf'))).toBe('unknown')
  })
})

describe('readNetcdfType', () => {
  it('rejects unknown bytes', async () => {
    expect(await readNetcdfType(new Blob(['not netcdf']))).toBe('unknown')
  })
})

describe('geoAxisOf', () => {
  it('reads the CF units, however they are spelled', () => {
    expect(geoAxisOf({ name: 'y', units: 'degrees_north' })).toBe('latitude')
    expect(geoAxisOf({ name: 'staLat', units: 'degree_N' })).toBe('latitude')
    expect(geoAxisOf({ name: 'x', units: 'degrees_east' })).toBe('longitude')
    expect(geoAxisOf({ name: 'Lo1', units: 'degreeE' })).toBe('longitude')
  })

  it('falls back to the CF standard name, then to the variable name', () => {
    expect(geoAxisOf({ name: 'y', standardName: 'latitude' })).toBe('latitude')
    expect(geoAxisOf({ name: 'XLONG', units: 'degrees' })).toBe('longitude')
    expect(geoAxisOf({ name: 'nav_lat' })).toBe('latitude')
  })

  it('leaves everything else unclassified', () => {
    expect(geoAxisOf({ name: 'time', units: 'hours since 1990-01-01' })).toBeUndefined()
    expect(geoAxisOf({ name: 'temperature', units: 'celsius' })).toBeUndefined()
    // a projected grid gives its axes in metres, and nothing here reprojects them
    expect(geoAxisOf({ name: 'x', units: 'm' })).toBeUndefined()
  })
})

describe('hasLatLonCoordinates', () => {
  it('needs both axes', () => {
    const lat = { name: 'lat', units: 'degrees_north' }
    const lon = { name: 'lon', units: 'degrees_east' }
    expect(hasLatLonCoordinates([lat, lon])).toBe(true)
    expect(hasLatLonCoordinates([lat])).toBe(false)
    expect(hasLatLonCoordinates([])).toBe(false)
  })
})

describe('getNetcdfVariables', () => {
  it('rejects any input that is not a File', async () => {
    await expect(getNetcdfVariables(new Blob([Uint8Array.of(...HDF5_MAGIC)]))).rejects.toThrow(
      NETCDF_ERRORS.InvalidData
    )
    expect(getNetcdf4VariablesFromFile).not.toHaveBeenCalled()
  })

  it('rejects NetCDF4 when Worker is unavailable', async () => {
    expect(typeof Worker).toBe('undefined')
    await expect(getNetcdfVariables(hdf5MagicFile())).rejects.toThrow(NETCDF_ERRORS.InvalidData)
    expect(getNetcdf4VariablesFromFile).not.toHaveBeenCalled()
  })

  it('reads NetCDF4 through the worker when given a File', async () => {
    vi.stubGlobal('Worker', class Worker {})
    vi.mocked(getNetcdf4VariablesFromFile).mockResolvedValue(['temperature'])
    const file = hdf5MagicFile()
    expect(await getNetcdfVariables(file)).toEqual(['temperature'])
    expect(getNetcdf4VariablesFromFile).toHaveBeenCalledWith(file)
  })

  it('rejects when the worker finds no griddable variables', async () => {
    vi.stubGlobal('Worker', class Worker {})
    vi.mocked(getNetcdf4VariablesFromFile).mockResolvedValue([])
    await expect(getNetcdfVariables(hdf5MagicFile())).rejects.toThrow(NETCDF_ERRORS.InvalidData)
  })

  it('rejects when the worker fails', async () => {
    vi.stubGlobal('Worker', class Worker {})
    vi.mocked(getNetcdf4VariablesFromFile).mockRejectedValue(new Error('WORKERFS is unavailable'))
    await expect(getNetcdfVariables(hdf5MagicFile())).rejects.toThrow(NETCDF_ERRORS.InvalidData)
  })

  it('rejects a file it cannot read', async () => {
    await expect(getNetcdfVariables(new File(['not netcdf'], 'upload.nc'))).rejects.toThrow(
      NETCDF_ERRORS.InvalidData
    )
  })
})

describe.skipIf(!downloaded)('unidata examples', () => {
  beforeAll(() => h5wasm.ready)

  describe('readNetcdfType', () => {
    it('reads a classic and a NetCDF4 example', async () => {
      expect(await readNetcdfType(asBlob('tos_O1_2001-2002.nc'))).toBe('netcdf3')
      expect(await readNetcdfType(asBlob('OMI-Aura_L2-example.nc'))).toBe('hdf5')
    })
  })

  describe('getNetcdf3Variables', () => {
    it('returns the griddable variables of a lat/lon grid', async () => {
      expect(await getNetcdf3Variables(asBlob('tos_O1_2001-2002.nc'))).toEqual(
        example('tos_O1_2001-2002.nc').variables
      )
    })

    it('returns empty for a file with no coordinate variables', async () => {
      expect(await getNetcdf3Variables(asBlob('testrh.nc'))).toEqual([])
    })

    it('returns empty for a projected image georeferenced by global attributes', async () => {
      expect(await getNetcdf3Variables(asBlob('19981111_0045.nc'))).toEqual([])
    })

    it('reads a header prefix rather than the whole file', async () => {
      // rhum.2003.nc is 61MB on disk; only its first 64KiB is ever parsed
      const rhum = example('rhum.2003.nc')
      const prefix = new Uint8Array(rhum.bytes)
      prefix.set(header(rhum).subarray(0, 64 * 1024))
      expect(await getNetcdf3Variables(new Blob([prefix]))).toEqual(rhum.variables)
    })

    it('rejects HDF5 bytes', async () => {
      await expect(getNetcdf3Variables(asBlob('OMI-Aura_L2-example.nc'))).rejects.toThrow()
    })
  })

  describe('listGriddableHdf5Variables', () => {
    it('keeps only root datasets with at least two dimensions, in file order', () => {
      const file = asHdf5('OMI-Aura_L2-example.nc')
      expect(listGriddableHdf5Variables(file)).toEqual(example('OMI-Aura_L2-example.nc').variables)
      file.close()
    })

    it('ignores datasets nested in groups', () => {
      // test_hgroups.nc holds its lat/lon inside groups, so the root has nothing griddable
      const file = asHdf5('test_hgroups.nc')
      expect(isGeospatialHdf5(file)).toBe(false)
      expect(listGriddableHdf5Variables(file)).toEqual([])
      file.close()
    })
  })

  describe('getNetcdfVariables', () => {
    it('lists griddable variables from a classic file', async () => {
      expect(await getNetcdfVariables(asFile('tos_O1_2001-2002.nc'))).toEqual(
        example('tos_O1_2001-2002.nc').variables
      )
    })

    it('rejects a classic file with no griddable variables', async () => {
      await expect(getNetcdfVariables(asFile('testrh.nc'))).rejects.toThrow(
        NETCDF_ERRORS.InvalidData
      )
    })
  })

  describe('every example', () => {
    it('covers all 30 files', () => {
      expect(UNIDATA_EXAMPLES).toHaveLength(30)
    })

    it.each(UNIDATA_EXAMPLES)('$file', async (entry) => {
      if (!entry.geospatial) {
        // no lat/lon axes means nothing is griddable, whatever the file otherwise holds
        expect(entry.variables).toEqual([])
      }
      if (entry.type === 'netcdf3') {
        const blob = new Blob([header(entry)])
        expect(await readNetcdfType(blob)).toBe('netcdf3')
        expect(await getNetcdf3Variables(blob)).toEqual(entry.variables)
        return
      }
      const file = asHdf5(entry.file)
      try {
        expect(await readNetcdfType(new Blob([header(entry)]))).toBe('hdf5')
        expect(isGeospatialHdf5(file)).toBe(entry.geospatial)
        expect(listGriddableHdf5Variables(file)).toEqual(entry.variables)
      } finally {
        file.close()
      }
    })

    it('finds a lat/lon grid in all but the three projected or grouped files', () => {
      expect(UNIDATA_EXAMPLES.filter((e) => !e.geospatial).map((e) => e.file)).toEqual([
        // georeference lives in global attributes of a Lambert conformal image
        '19981111_0045.nc',
        // lat/lon exist, but only inside groups — the root is empty
        'test_hgroups.nc',
        // no coordinate variables at all
        'testrh.nc',
      ])
    })
  })
})
