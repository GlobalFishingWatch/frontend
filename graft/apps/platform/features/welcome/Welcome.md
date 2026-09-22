# apps/platform/features/welcome/Welcome.tsx · [[welcome-modal-content]]

React component that displays a localized welcome modal popup with configurable content, language selection, and user preferences for dismissal.

- WelcomeProps · type · L25-L27 — Specifies the required properties for the Welcome component.
- WelcomeLocalStorageKey · type · L29-L29 — Defines the shape of welcome popup state persisted to local storage, tracking visibility and user preference to show again.
- Welcome · function · L31-L120 — Manages display and dismissal of a localized welcome popup modal, handling version-based updates and user preferences to suppress future displays.
