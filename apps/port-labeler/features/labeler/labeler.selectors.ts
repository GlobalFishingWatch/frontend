import { createSelector } from "@reduxjs/toolkit"
import {
  selectCountry,
  selectMapData,
  selectPointValues,
  selectPortValues,
  selectSelectedPoints,
  selectSubareas,
  selectSubareaValues
} from "features/labeler/labeler.slice"
import { PortPosition } from "types"



/**
 * filter the poins by country
 */
export const selectPortPointsByCountry = createSelector([selectMapData, selectCountry],
  (data, selectedCountry): PortPosition[] => data?.filter((point) => point.iso3 === selectedCountry) || []
)

/**
 * filter the poinst if some are selected
 */
export const selectFilteredPoints = createSelector([selectPortPointsByCountry, selectSelectedPoints],
  (records, selected): PortPosition[] => {
    return records?.filter((record) => !selected.length || selected.indexOf(record.s2id) !== -1)
  }
)

/**
 * get subareas by country
 */
export const selectSubareaValuesByCountry = createSelector([selectSubareaValues, selectCountry],
  (data, selectedCountry) => data[selectedCountry] ?? []
)

/**
 * get points by country
 */
export const selectPointValuesByCountry = createSelector([selectPointValues, selectCountry],
  (data, selectedCountry) => data[selectedCountry]
)

/**
 * get points by country
 */
export const selectPortValuesByCountry = createSelector([selectPortValues, selectCountry],
  (data, selectedCountry) => data[selectedCountry]
)

/**
 * return a map of the subarea colors
 */
export const selectSubareaColors = createSelector([selectSubareas],
  (subareas): any => {
    const colorsMap = {}
    subareas.forEach(subarea => {
      colorsMap[subarea.id] = subarea.color
    })

    return colorsMap
  }
)