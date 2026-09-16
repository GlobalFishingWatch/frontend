# apps/platform/features/_vessels/vessel/activity/event/EventDetail.tsx · [[vessel-activity-event-system]]

Renders detailed information for vessel events (encounters, fishing, loitering, port visits) with timestamps, coordinates, vessel details, and regulatory authorization statuses.

- ActivityContentProps · interface · L27-L29 — Type definition for the props required to render activity event details.
- TimeFields · function · L33-L76 — Renders the start, end, and duration time fields of an event with solar status indicators.
- PortVisitedAfterField · function · L78-L95 — Displays the next port visited after an event if available, with a link to the port report.
- EventDetail · function · L97-L286 — Renders event-specific details (encounter with authorization table, fishing speed, loitering distance, or port/gap metadata) based on event type.
