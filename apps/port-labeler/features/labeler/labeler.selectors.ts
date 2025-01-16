import { createSelector } from "@reduxjs/toolkit"
import type { PortPosition } from "types"

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

/**
 * filter the poins by country
 */
export const selectPortPointsByCountry = createSelector([selectMapData, selectCountry],
  (data, selectedCountry): PortPosition[] => data?.filter((point) => !selectedCountry || point.iso3 === selectedCountry) || []
)

/**
 * filter the points if some are selected, else return all the points of the country
 */
export const selectFilteredPoints = createSelector([selectPortPointsByCountry, selectSelectedPoints],
  (records, selected): PortPosition[] => {
    return records?.filter((record) => !selected.length || selected.indexOf(record.s2id) !== -1)
  }
)

/**
 * get subareas by country (subareas are polygons that group positions in a part of every port)
 */
export const selectSubareaValuesByCountry = createSelector([selectSubareaValues, selectCountry],
  (data, selectedCountry) => data[selectedCountry] ?? []
)

/**
 * return the map of values assigned to the points, this means the name that every point has
 */
export const selectPointValuesByCountry = createSelector([selectPointValues, selectCountry],
  (data, selectedCountry) => selectedCountry ? data[selectedCountry] : data
)

/**
 * return the map of port assigned to the points
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

// Return the list of ports by selected country
export const selectPortsByCountry = createSelector([selectPorts, selectCountry],
  (ports, country): any => {
    return ports[country]
  })

// the list of subareas by selected country
export const selectSubareasByCountry = createSelector([selectSubareas, selectCountry],
  (subareas, country): any => {
    return subareas[country]
  })

// this generate the port options for the selects in the table
export const selectPortsOptions = createSelector([selectPorts, selectCountry],
  (ports, country) => {
    if (!ports || !country) {
      return []
    }

    return ports[country].map(port => { return { label: port.name, id: port.id } })
  })

// this generate the subarea options for the selects in the table
export const selectSubareaOptions = createSelector([selectSubareas, selectCountry],
  (subareas, country) => {
    if (!subareas || !country) {
      return []
    }
    return subareas[country].map(subarea => {
      return {
        label: subarea.name,
        id: subarea.id,
        color: subarea.color
      }
    })
  })