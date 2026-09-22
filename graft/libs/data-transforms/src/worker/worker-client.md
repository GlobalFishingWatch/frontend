# libs/data-transforms/src/worker/worker-client.ts · [[worker-client-error-handling]] [[worker-client-request-response-messaging]]

- WorkerRequestMessage · type · L9-L9 — Defines the structure of a message sent from the main thread to a worker, pairing a unique correlation ID with a payload.
- WorkerResponseMessage · type · L11-L12 — Defines the structure of a message returned from a worker to the main thread, pairing a correlation ID with either a result or an error string.
- PendingRequest · type · L14-L17 — Holds the promise callbacks for a single in-flight request, allowing the worker response to resolve or reject it.
- createWorkerClient · function · L30-L85 — Creates a client that lazily instantiates a worker and manages async request/response cycles with correlation IDs, error handling, and termination.
- rejectAll · function · L35-L39 — Clears all pending requests and rejects them with the provided error, used when the worker crashes or is terminated.
- getWorker · function · L41-L63 — Lazily initializes the worker on first access and wires up message handlers to resolve pending requests or fatal error cleanup.
- handleWorkerRequests · function · L91-L107 — Worker-side handler that serializes incoming jobs into a queue and sends back correlated responses, ensuring no interleaved execution of jobs.
