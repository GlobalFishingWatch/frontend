# apps/platform/features/_vessels/track-correction/track-correction.hooks.ts · [[track-correction-feature]]

Hook module providing utilities to manage track correction state and fetch track issues for the current workspace.

- useSetTrackCorrectionId · function · L14-L22 — Hook that returns a callback to update the URL query parameters with a track correction ID.
- useFetchTrackCorrections · function · L24-L52 — Hook that fetches track correction issues for a workspace, guarded by guest status and workspace type checks, and automatically triggers when the current workspace changes.
