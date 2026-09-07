import { afterEach, describe, expect, it, vi } from 'vitest'

import type { WorkerRequestMessage, WorkerResponseMessage } from './worker-client'
import { createWorkerClient } from './worker-client'

/** Minimal stand-in for the browser Worker: records posts, replies on demand, tracks terminate. */
class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage: ((event: MessageEvent<WorkerResponseMessage<string>>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  posted: WorkerRequestMessage<string>[] = []
  terminated = false

  constructor() {
    FakeWorker.instances.push(this)
  }

  postMessage(message: WorkerRequestMessage<string>) {
    this.posted.push(message)
  }

  terminate() {
    this.terminated = true
  }

  reply(response: WorkerResponseMessage<string>) {
    this.onmessage?.({ data: response } as MessageEvent<WorkerResponseMessage<string>>)
  }
}

vi.stubGlobal('Worker', FakeWorker)

const workerUrl = new URL('file:///fake.worker.js')

afterEach(() => {
  FakeWorker.instances = []
})

describe('createWorkerClient', () => {
  it('settles each request by id, out of order, and ignores unknown ids', async () => {
    const client = createWorkerClient<string, string>(workerUrl)
    const first = client.request('a')
    const second = client.request('b')
    const [worker] = FakeWorker.instances

    expect(FakeWorker.instances).toHaveLength(1)
    expect(worker.posted).toEqual([
      { id: 0, payload: 'a' },
      { id: 1, payload: 'b' },
    ])

    worker.reply({ id: 99, result: 'nobody' })
    worker.reply({ id: 1, result: 'B' })
    worker.reply({ id: 0, result: 'A' })

    await expect(first).resolves.toBe('A')
    await expect(second).resolves.toBe('B')
  })

  it('rejects with the error the worker reports', async () => {
    const client = createWorkerClient<string, string>(workerUrl)
    const request = client.request('a')
    FakeWorker.instances[0].reply({ id: 0, error: 'invalid data' })
    await expect(request).rejects.toThrow('invalid data')
  })

  it('terminate rejects pending requests and the next request spawns a new worker', async () => {
    const client = createWorkerClient<string, string>(workerUrl)
    const request = client.request('a')
    client.terminate()

    await expect(request).rejects.toThrow('Worker terminated')
    expect(FakeWorker.instances[0].terminated).toBe(true)

    const next = client.request('b')
    expect(FakeWorker.instances).toHaveLength(2)
    FakeWorker.instances[1].reply({ id: 1, result: 'B' })
    await expect(next).resolves.toBe('B')
  })
})
