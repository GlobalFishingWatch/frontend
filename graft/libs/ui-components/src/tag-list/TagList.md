# libs/ui-components/src/tag-list/TagList.tsx · [[css-modules-and-styling-architecture]] [[memoization-and-performance-optimization]] [[tag-system]]

React component library module that exports a reusable TagList component for displaying and managing collections of interactive tags with optional removal callbacks.

- TagListProps · interface · L10-L16 — Configuration interface defining the props contract for TagList component, including styling, tag data, and removal event handler.
- TagList · function · L18-L47 — Renders a list of interactive Tag components with optional removal capability, filtering the remaining tags and invoking the onRemove callback when a tag is deleted.
