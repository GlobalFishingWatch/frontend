# libs/timebar/src/components/playback.tsx · [[playback-control-system]]

Playback control component for a timebar that supports play, pause, speed adjustment, looping, and frame-by-frame navigation.

- PlaybackProps · type · L20-L24 — Type definition for optional props controlling playback UI behavior including play state callback and disabled state.
- TimebarPlayback · function · L26-L236 — Main React component that renders interactive playback controls (play/pause, speed, loop, forward/back buttons) synchronized with a shared timebar range.
- tick · function · L132-L148 — Animation frame callback that measures elapsed time and throttles playback updates to prevent tab-resume jitter by capping frame progress.
