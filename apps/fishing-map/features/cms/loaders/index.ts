import {
  getAll as getAllUserGuide,
  getById as getByIdUserGuide,
  getContentFromSubcontentId,
} from 'features/cms/loaders/userGuide'

export const strapiApi = {
  userGuide: {
    getById: getByIdUserGuide,
    getAll: getAllUserGuide,
    getContentFromSubcontentId: getContentFromSubcontentId,
  },
}
