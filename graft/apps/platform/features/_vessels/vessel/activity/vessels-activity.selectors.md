# apps/platform/features/_vessels/vessel/activity/vessels-activity.selectors.ts · [[event-grouping-summarization]] [[redux-state-selectors-pattern]] [[vessel-activity-event-system]]

Redux selectors module that computes derived vessel activity event data organized by type, voyage, area, and encounter details for profile display.

- ActivityEvent · interface · L22-L25 — Event type enriched with voyage identifier and optional activity event subtype for distinguishing port entry/exit transitions.
