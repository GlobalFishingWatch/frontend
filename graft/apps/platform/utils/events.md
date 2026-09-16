# apps/platform/utils/events.tsx · [[maritime-event-utilities]]

Utility module for formatting and describing fishing vessel events with localized labels, durations, and event-specific details.

- getEventColors · function · L18-L31 — Retrieves color styling and color labels for a given event type from the events color configuration.
- getEventDurationLabel · function · L33-L48 — Formats a duration object into a human-readable string with localized day, hour, and minute abbreviations based on magnitude thresholds.
- TimeLabels · type · L50-L53 — Type definition for event time labels containing formatted start time and duration strings.
- getTimeLabels · function · L54-L72 — Computes formatted start datetime and duration labels by calculating the time difference between two dates.
- getLonglineCategoryLabel · function · L74-L85 — Maps longline fishing categories to localized label strings based on day/night distribution.
- getEventDescription · function · L87-L166 — Generates localized descriptions for fishing events by branching on event type and extracting relevant vessel, port, or category details.
