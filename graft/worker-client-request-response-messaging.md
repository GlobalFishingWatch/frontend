---
name: Worker Client Request/Response Messaging
slug: worker-client-request-response-messaging
type: system
sources:
  - path: libs/data-transforms/src/worker/index.ts
    hash: 492f3f30ab42791f9c3ed0944b133ca683ffe08ee6fd1f8a72e7821bdc0ff867
  - path: libs/data-transforms/src/worker/worker-client.ts
    hash: 7b56522f32f90f03138436cd84a05e5d8ef0e3cd699edf63179de37c89839195
sources_digest: 42148444987aa0c913b77f767dc5d2c3c676bd70404e1f69e26fc76395a7b89e
links:
  - to: worker-client-error-handling
    relation: implements
    description: >-
      Serializes errors as strings since Error objects cannot cross the worker
      message boundary
generator:
  version: 1
covers:
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

Bidirectional message correlation between main thread and Web Workers using monotonic request IDs to match responses out of order. createWorkerClient on the main thread lazily instantiates Worker, tracks pending responses in a Map, and handles both success and error cases. handleWorkerRequests runs inside the worker and processes messages sequentially through a promise queue to prevent interleaving of stateful jobs (e.g., h5wasm's emscripten FS). All pending requests are rejected if the worker errors or terminates, then a fresh worker is spawned on the next request.

## Related

- implements [[worker-client-error-handling]] — Serializes errors as strings since Error objects cannot cross the worker message boundary

<!-- context:generated:end -->

## Notes

_Anything written below the generated block is preserved when the graph is regenerated._
