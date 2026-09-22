---
name: Worker Client Error Handling
slug: worker-client-error-handling
type: concept
sources:
  - path: libs/data-transforms/src/worker/worker-client.test.ts
    hash: f2f4594148b8b4e297d4525a040e7434d17202fb40fd8c57ddb491f6dcdbdf83
  - path: libs/data-transforms/src/worker/worker-client.ts
    hash: 7b56522f32f90f03138436cd84a05e5d8ef0e3cd699edf63179de37c89839195
sources_digest: 3754294ca4432380dbd6cf53073a293b36aab002969be7bf165fa6b082566424
links:
  - to: worker-client-request-response-messaging
    relation: part_of
    description: Core error handling strategy for worker message correlation
generator:
  version: 1
covers:
  - symbol: FakeWorker
    kind: class
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L7-L29'
  - symbol: constructor
    kind: method
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L14-L16'
  - symbol: postMessage
    kind: method
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L18-L20'
  - symbol: terminate
    kind: method
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L22-L24'
  - symbol: reply
    kind: method
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L26-L28'
  - symbol: createFakeWorker
    kind: function
    at: 'libs/data-transforms/src/worker/worker-client.test.ts:L32-L32'
  - symbol: WorkerRequestMessage
    kind: type
    at: 'libs/data-transforms/src/worker/worker-client.ts:L9-L9'
  - symbol: WorkerResponseMessage
    kind: type
    at: 'libs/data-transforms/src/worker/worker-client.ts:L11-L12'
  - symbol: PendingRequest
    kind: type
    at: 'libs/data-transforms/src/worker/worker-client.ts:L14-L17'
  - symbol: createWorkerClient
    kind: function
    at: 'libs/data-transforms/src/worker/worker-client.ts:L30-L85'
  - symbol: rejectAll
    kind: function
    at: 'libs/data-transforms/src/worker/worker-client.ts:L35-L39'
  - symbol: getWorker
    kind: function
    at: 'libs/data-transforms/src/worker/worker-client.ts:L41-L63'
  - symbol: handleWorkerRequests
    kind: function
    at: 'libs/data-transforms/src/worker/worker-client.ts:L91-L107'
---

<!-- context:generated:start -->

## Summary

Errors in worker contexts must be serialized as strings (not Error objects) when crossing the message boundary. The main thread rejects all pending requests if the worker errors or is terminated, then transparently spawns a replacement worker on the next request. This allows callers to handle worker failures without propagating exceptions through promise chains, and enables recovery from transient errors without application restart.

## Related

- part of [[worker-client-request-response-messaging]] — Core error handling strategy for worker message correlation

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
