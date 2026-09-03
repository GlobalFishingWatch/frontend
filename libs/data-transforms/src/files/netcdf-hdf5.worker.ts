import type { Dataset, Group } from 'h5wasm'
import h5wasm, { FS, ready } from 'h5wasm'

import { handleWorkerRequests } from '../worker'

import { hasLatLonCoordinates, NETCDF_ERRORS } from './netcdf-variables'

/** A griddable variable spans at least latitude and longitude, so 1-D coordinates are out */
export const MIN_HDF5_DIMENSIONS = 2

const isDataset = (entry: ReturnType<Group['get']>): entry is Dataset =>
  entry != null && 'shape' in entry && 'dtype' in entry

/** h5wasm hands attribute values back as a scalar or as a one-entry array, depending on the file */
const attributeText = (dataset: Dataset, name: string): string | undefined => {
  const value = dataset.attrs?.[name]?.value
  const text = Array.isArray(value) ? value[0] : value
  return typeof text === 'string' ? text : undefined
}

const rootDatasets = (root: Group) =>
  root
    .keys()
    .map((name) => ({ name, dataset: root.get(name) }))
    .filter((entry): entry is { name: string; dataset: Dataset } => isDataset(entry.dataset))

/** Whether a NetCDF4 root group carries both geographic axes as datasets of their own. */
export const isGeospatialHdf5 = (root: Group): boolean =>
  hasLatLonCoordinates(
    rootDatasets(root).map(({ name, dataset }) => ({
      name,
      units: attributeText(dataset, 'units'),
      standardName: attributeText(dataset, 'standard_name'),
    }))
  )

export function listGriddableHdf5Variables(root: Group): string[] {
  if (!isGeospatialHdf5(root)) {
    return []
  }
  return rootDatasets(root)
    .filter(({ dataset }) => (dataset.shape?.length ?? 0) >= MIN_HDF5_DIMENSIONS)
    .map(({ name }) => name)
}

const MOUNT_POINT = '/work'
const FALLBACK_NAME = 'upload.nc'

const resetWorkMount = () => {
  if (!FS) {
    return
  }
  try {
    FS.unmount(MOUNT_POINT)
  } catch {
    // not mounted
  }
  try {
    FS.rmdir(MOUNT_POINT)
  } catch {
    // missing or not empty
  }
}

const readVariablesFromFile = async (file: File): Promise<string[]> => {
  await ready
  if (!FS?.filesystems.WORKERFS) {
    throw new Error('WORKERFS is unavailable')
  }

  resetWorkMount()
  FS.mkdir(MOUNT_POINT)

  const mountName = file.name || FALLBACK_NAME
  if (file.name) {
    FS.mount(FS.filesystems.WORKERFS, { files: [file] }, MOUNT_POINT)
  } else {
    FS.mount(FS.filesystems.WORKERFS, { blobs: [{ name: mountName, data: file }] }, MOUNT_POINT)
  }

  const hdfFile = new h5wasm.File(`${MOUNT_POINT}/${mountName}`, 'r')
  try {
    const variables = listGriddableHdf5Variables(hdfFile)
    if (!variables.length) {
      throw new Error('no griddable variables')
    }
    return variables
  } finally {
    hdfFile.close()
    resetWorkMount()
  }
}

handleWorkerRequests<File, string[]>(async (file) => {
  try {
    return await readVariablesFromFile(file)
  } catch {
    // every failure in here is the same thing to the caller: this is not usable NetCDF4
    throw new Error(NETCDF_ERRORS.InvalidData)
  }
})
