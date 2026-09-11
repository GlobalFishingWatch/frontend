import { createWorkerClient } from '../worker'

const netcdf4Client = createWorkerClient<File, string[]>(
  () => new Worker(new URL('./netcdf-hdf5.worker.js', import.meta.url), { type: 'module' })
)

/** NetCDF4 (HDF5) only — opened read-only on WORKERFS inside a Web Worker. */
export function getNetcdf4VariablesFromFile(file: File): Promise<string[]> {
  return netcdf4Client.request(file)
}
