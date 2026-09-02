import type { NETCDF_ERRORS } from './netcdf-variables'

type Request = {
  resolve: (variables: string[]) => void
  reject: (error: Error) => void
}

let worker: Worker | undefined
let idCounter = 0
const requests = new Map<number, Request>()

function getWorker() {
  if (worker === undefined) {
    worker = new Worker(new URL('./netcdf-hdf5.worker.js', import.meta.url), {
      type: 'module',
    })
    worker.onmessage = ({
      data,
    }: MessageEvent<{
      id: number
      variables?: string[]
      error?: typeof NETCDF_ERRORS.InvalidData
    }>) => {
      const request = requests.get(data.id)
      if (!request) {
        return
      }
      requests.delete(data.id)
      if (data.error) {
        request.reject(new Error(data.error))
        return
      }
      if (data.variables) {
        request.resolve(data.variables)
      }
    }
    worker.onerror = (ev: ErrorEvent) => {
      requests.forEach((request) => request.reject(ev.error ?? new Error(String(ev.message))))
      requests.clear()
    }
  }
  return worker
}

/** NetCDF4 (HDF5) only — opened read-only on WORKERFS inside a Web Worker. */
export function getNetcdf4VariablesFromFile(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const id = idCounter++
    requests.set(id, { resolve, reject })
    getWorker().postMessage({ id, file })
  })
}
