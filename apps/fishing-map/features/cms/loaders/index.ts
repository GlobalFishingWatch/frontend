import { getAll as getAllDatasets, getById as getByIdDatasets } from 'features/cms/loaders/datasets'
import {
  getAll as getAllUserGuide,
  getById as getByIdUserGuide,
} from 'features/cms/loaders/userGuide'

export const strapiApi = {
  userGuide: { getById: getByIdUserGuide, getAll: getAllUserGuide },
  datasets: { getById: getByIdDatasets, getAll: getAllDatasets },
}
