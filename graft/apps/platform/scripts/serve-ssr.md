# apps/platform/scripts/serve-ssr.mjs · [[ssr-dev-server-process-manager]]

Server-side rendering (SSR) entry point that spawns a Node process, manages graceful shutdown with signal handling, and enforces a 3-second timeout before forceful termination.

- exitNow · function · L19-L28 — Immediately terminates the child process if running and exits the parent process with the given exit code.
- shutdown · function · L30-L48 — Gracefully shuts down the running child process by sending SIGTERM and scheduling a forceful kill after 3 seconds if it does not exit.
