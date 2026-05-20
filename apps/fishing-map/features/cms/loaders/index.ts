import { getAll as getAllDatasets, getById as getByIdDatasets } from 'features/cms/loaders/datasets'
import {
  getAll as getAllUserGuide,
  getById as getByIdUserGuide,
  getContentFromSubcontentId,
} from 'features/cms/loaders/userGuide'
import { getFiltersInDataview } from 'features/dataviews/dataviews.filters'

export const strapiApi = {
  userGuide: {
    getById: getByIdUserGuide,
    getAll: getAllUserGuide,
    getContentFromSubcontentId: getContentFromSubcontentId,
  },
  datasets: {
    getById: getByIdDatasets,
    getAll: getAllDatasets,
    // getFiltersInDataview: getFiltersInDataview,
  },
}
