import { createSelector } from "@reduxjs/toolkit"
import { selectSubareas } from "features/labeler/labeler.slice"

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
