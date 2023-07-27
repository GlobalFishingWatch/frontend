import { createSelector } from '@reduxjs/toolkit'
import {
  EEZ_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
} from 'data/workspaces'
import { selectDataviewBySlug } from 'features/dataviews/dataviews.slice'

export const selectRegionsDatasets = createSelector(
  [
    selectDataviewBySlug(EEZ_DATAVIEW_SLUG),
    selectDataviewBySlug(MPA_DATAVIEW_SLUG),
    selectDataviewBySlug(RFMO_DATAVIEW_SLUG),
    selectDataviewBySlug(FAO_AREAS_DATAVIEW_SLUG),
  ],
  (eez, mpa, rfmo, fao) => {
    return {
      eez: eez?.config?.layers?.[0].dataset as string,
      mpa: mpa?.config?.layers?.[0].dataset as string,
      rfmo: rfmo?.config?.layers?.[0].dataset as string,
      fao: fao?.config?.layers?.[0].dataset as string,
    }
  }
)
