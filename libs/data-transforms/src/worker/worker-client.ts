/**
 * Request/response plumbing shared by the Web Workers in the workspace:
 * correlation ids and a promise per request.
 *
 * Both halves of the contract live here — `createWorkerClient` on the main thread,
 * `handleWorkerRequests` inside the worker — so the message shape cannot drift between them.
 */

export type WorkerRequestMessage<Payload> = { id: number; payload: Payload }

export type WorkerResponseMessage<Result> =
  { id: number; result: Result } | { id: number; error: string }

type PendingRequest<Result> = {
  resolve: (result: Result) => void
  reject: (error: unknown) => void
}

/**
 * Pass a factory, with the `new URL(..., import.meta.url)` literal written inline inside the
 * `new Worker(...)` call:
 *
 *     createWorkerClient(() => new Worker(new URL('./x.worker.js', import.meta.url), { type: 'module' }))
 *
 * That exact shape is what the bundler statically detects in order to emit a worker chunk. Hoisting
 * the URL out — into a variable, or into this function's argument as it used to be — leaves the
 * bundler seeing a bare `new URL`, which it treats as a plain asset: the worker entry is emitted
 * verbatim and unbundled, so the worker fails to load and `onerror` fires with no message.
 */
export function createWorkerClient<Payload, Result>(createWorker: () => Worker) {
  let worker: Worker | undefined
  let idCounter = 0
  const requests = new Map<number, PendingRequest<Result>>()

  const rejectAll = (error: unknown) => {
    const pending = [...requests.values()]
    requests.clear()
    pending.forEach((request) => request.reject(error))
  }

  const getWorker = () => {
    if (worker === undefined) {
      worker = createWorker()
      worker.onmessage = ({ data }: MessageEvent<WorkerResponseMessage<Result>>) => {
        const request = requests.get(data.id)
        if (!request) {
          return
        }
        requests.delete(data.id)
        if ('error' in data) {
          request.reject(new Error(data.error))
          return
        }
        request.resolve(data.result)
      }
      worker.onerror = (event: ErrorEvent) =>
        rejectAll(event.error ?? new Error(String(event.message)))
    }
    return worker
  }

  return {
    request: (payload: Payload) =>
      new Promise<Result>((resolve, reject) => {
        const id = idCounter++
        requests.set(id, { resolve, reject })
        const message: WorkerRequestMessage<Payload> = { id, payload }
        getWorker().postMessage(message)
      }),
    /** Kills the worker and rejects everything in flight. The next request spawns a fresh one. */
    terminate: () => {
      rejectAll(new Error('Worker terminated'))
      worker?.terminate()
      worker = undefined
    },
  }
}

/**
 * Worker-side counterpart of `createWorkerClient`. Jobs run one at a time: a worker holding
 * global state (h5wasm's emscripten FS mount, for one) cannot have two jobs interleaved.
 */
export function handleWorkerRequests<Payload, Result>(
  handler: (payload: Payload) => Result | Promise<Result>
) {
  let queue = Promise.resolve()
  addEventListener('message', (event: MessageEvent<WorkerRequestMessage<Payload>>) => {
    const { id, payload } = event.data
    queue = queue.then(async () => {
      let response: WorkerResponseMessage<Result>
      try {
        response = { id, result: await handler(payload) }
      } catch (error) {
        response = { id, error: error instanceof Error ? error.message : String(error) }
      }
      postMessage(response)
    })
  })
}
