import type { Dispatch } from 'redux'
import type { StateGetter } from 'redux-first-router'

import { GFWAPI } from '@globalfishingwatch/api-client'

import { selectIsImportView, selectVessel } from '../../routes/routes.selectors'
import type { AppState } from '../../types/redux.types'
import { getVesselInfo } from '../tracks/tracks.selectors'

import type { VesselInfo } from './vessels.slice';
import { selectImportedData, setVesselInfo } from './vessels.slice'

// TODO to be finished when the api is ready
const fetchVesselInfo = async (id: string) => {
  const url = `/v1/vessels/${id}?datasets=public-global-vessels:v20190502`
  const data: VesselInfo = await GFWAPI.fetch<any>(url).then((r) => {
    //console.log('-------------- VESSEL INFO -----------------')
    //console.log(r)

    return r
  })

  return data
}

// TODO to be finished when the api is ready
export const vesselInfoThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const id = selectVessel(state)

  const isImportView = selectIsImportView(state)
  const importedData = selectImportedData(state)
  if ((isImportView && importedData) || !id || id === 'NA') {
    return null
  }
  const vessel = getVesselInfo(state)
  if (vessel?.id === id) {
    return null
  }
  const data = await fetchVesselInfo(id)
  try {
    dispatch(
      setVesselInfo({
        id: id,
        data: data,
      })
    )
  } catch (e) {
    console.error(e)
    //dispatch(fetchTrackError({ id, error: e }))
  }
}
