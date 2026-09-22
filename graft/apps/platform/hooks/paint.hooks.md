# apps/platform/hooks/paint.hooks.ts · [[performance-screenshot-system]]

React hook module that executes callbacks after the browser has painted the next frame.

- runAfterFramePaint · function · L3-L10 — Schedules a callback to execute after the current frame has been painted by queuing it via MessageChannel instead of microtasks.
- useCallbackAfterPaint · function · L12-L31 — React hook that conditionally invokes a callback after paint when the component signals it is ready via the enabled flag.
