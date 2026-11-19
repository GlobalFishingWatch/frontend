export const MAP_POPUP_TESTID = 'map-popup-wrapper'
export const MAP_LOADING_SPINNER_TESTID = 'map-loading-spinner'
/** deck.gl view id; the rendered element id is `view-${MAP_VIEW_ID}` */
export const MAP_VIEW_ID = 'mapViewport'
export const SIDEBAR_CONTAINER_TESTID = 'sidebar-container'

export const getActivityLayerSwitchTestId = (dataviewId: string) =>
  `activity-layer-panel-switch-${dataviewId}`
export const getContextLayerTestId = (dataviewId: string) => `context-layer-${dataviewId}`
/**
 * One per schema filter of a layer (flag, geartype, vessel type…). The MultiSelect derives
 * `${id}-input` and `${id}-option-${optionId}` from it. Without it every schema filter shared the
 * component default, `multi-select`, and specs had to guess which one came first.
 */
export const getLayerSchemaFilterTestId = (filterId: string) => `layer-filter-${filterId}`
