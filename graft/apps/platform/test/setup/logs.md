# apps/platform/test/setup/logs.ts · [[authentication-and-token-management]] [[test-infrastructure-and-utilities]]

Module providing log stream management utilities for test setup that writes timestamped messages to both console and file.

- closeLogStream · function · L5-L10 — Safely closes and nullifies the log stream if it exists and is still writable.
- initLogStream · function · L12-L15 — Closes any existing log stream and opens a new append-mode write stream to the specified file path.
- log · function · L17-L23 — Writes a timestamped message to console and appends it to the active log stream if available.
