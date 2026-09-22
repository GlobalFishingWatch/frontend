# apps/platform/features/_vessels/track-correction/track-correction.slice.ts · [[api-error-handling-async-status-tracking]] [[redux-state-selectors-pattern]] [[track-correction-feature]]

Redux slice managing vessel track correction issues with state for new issues, comments, and workspace-scoped issue tracking.

- IssueType · type · L10-L10 — Union type classifying track correction issues as false positives, false negatives, or other categories.
- TrackCorrectionComment · type · L12-L23 — Data structure representing a comment on a track correction issue with metadata and correction dates.
- TrackCorrection · type · L25-L46 — Data structure representing a complete track correction issue with vessel, temporal, and spatial metadata.
- TrackCorrectionState · type · L48-L59 — Redux state shape storing new issue drafts, pending comments, and workspace-indexed issue collections with async status.
- CreateNewIssueThunkParam · type · L74-L78 — Parameter type for the async thunk that submits a new track correction issue and initial comment to a workspace.
- CreateCommentThunkParam · type · L111-L115 — Parameter type for the async thunk that adds a comment to an existing track correction issue.
- FetchTrackCorrectionsThunkParam · type · L144-L146 — Parameter type for the async thunk that retrieves all track correction issues for a workspace.
- selectTrackCorrectionVesselDataviewId · function · L231-L232 — Selector that retrieves the vessel dataview ID from the track correction new issue draft.
- selectTrackCorrectionTimerange · function · L234-L235 — Selector that retrieves the start and end dates from the track correction new issue draft.
- selectTrackIssueType · function · L237-L237 — Selector that retrieves the issue type classification from the track correction new issue draft.
- selectTrackIssueComment · function · L239-L239 — Selector that retrieves the pending comment text from the track correction state.
- selectTrackCorrectionState · function · L241-L241 — Selector that returns the entire track correction state object.
- selectWorkspacesTrackCorrectionIssues · function · L243-L244 — Selector that retrieves the workspace-keyed mapping of track correction issues with async status.
