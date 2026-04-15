import {
  getAll as getAllDatasets,
  getById as getByIdDatasets,
} from 'features/content/loaders/datasets'
import {
  getAll as getAllUserGuide,
  getById as getByIdUserGuide,
} from 'features/content/loaders/userGuide'

export const strapiApi = {
  userGuide: { getById: getByIdUserGuide, getAll: getAllUserGuide },
  datasets: { getById: getByIdDatasets, getAll: getAllDatasets },
}
