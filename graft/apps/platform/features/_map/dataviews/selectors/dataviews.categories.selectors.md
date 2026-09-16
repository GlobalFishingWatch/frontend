# apps/platform/features/_map/dataviews/selectors/dataviews.categories.selectors.ts · [[dataviews-management]] [[memoized-dataview-selectors-for-performance]]

Redux selector module that provides specialized queries to retrieve dataviews filtered by category, visibility status, and report type for the map visualization layer.

- selectDataviewInstancesByCategory · function · L26-L33 — Returns a Redux selector that filters resolved dataview instances to those matching a specified category.
- selectActiveDataviewInstancesByCategory · function · L35-L45 — Returns a Redux selector that filters visible dataview instances by category, excluding dataset comparison duplicates.
