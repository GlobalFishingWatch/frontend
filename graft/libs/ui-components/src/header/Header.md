# libs/ui-components/src/header/Header.tsx · [[header-navigation-system]] [[navigation-data-structure]]

A reusable header component that renders the Global Fishing Watch navigation menu with user authentication state and responsive mobile support.

- MenuItem · type · L149-L157 — Defines the structure of a menu item including label, href, nested items, click handlers, and custom content rendering.
- HeaderProps · interface · L159-L168 — Defines the configuration props for the Header component including branding URL, user data, and authentication callbacks.
- HeaderMenuItemProps · interface · L169-L172 — Defines the props required to render a single header menu item with its index and menu data.
- HeaderMenuItem · function · L174-L221 — Renders a recursive menu item with support for multi-level nested items, toggleable submenus, and custom click handlers.
- getUserMenuItem · function · L223-L261 — Constructs a user profile menu item displaying the user's initials and providing access to settings and logout actions.
- Header · function · L263-L323 — Renders the main application header with navigation menu, logo, mobile toggle, and user authentication UI based on logged-in state.
