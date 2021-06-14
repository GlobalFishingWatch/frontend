import { AppDispatch } from 'store'
import { fetchRegionsThunk } from './regions.slice'

export const initializeRegions = async (dispatch: AppDispatch) => {
  await dispatch(fetchRegionsThunk())
}
