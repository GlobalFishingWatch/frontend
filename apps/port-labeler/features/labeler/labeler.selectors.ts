import { createSelector } from "@reduxjs/toolkit"
import {
  selectCountry,
  selectMapData,
  selectPointValues,
  selectPorts,
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
export const selectSubareaColors = createSelector([selectSubareas, selectCountry],
  (subareas, country): any => {
    const colorsMap = {}
    if (subareas[country]) {
      subareas[country].forEach((subarea) => {
        colorsMap[subarea.id] = subarea.color
      })
    }
    return colorsMap
  }
)

export const selectPortsByCountry = createSelector([selectPorts, selectCountry],
  (ports, country): any => {
    return ports[country]
  })

export const selectSubareasByCountry = createSelector([selectSubareas, selectCountry],
  (subareas, country): any => {
    return subareas[country]
  })

export const selectPortsOptions = createSelector([selectPorts, selectCountry],
  (ports, country) => {
    const options = ports[country].map(port => { return { label: port.name, id: port.id } })
    return options
  })

export const selectSubareaOptions = createSelector([selectSubareas, selectCountry],
  (subareas, country) => {
    const options = subareas[country].map(subarea => {
      return {
        label: subarea.name,
        id: subarea.id,
        color: subarea.color
      }
    })
    return options
  })