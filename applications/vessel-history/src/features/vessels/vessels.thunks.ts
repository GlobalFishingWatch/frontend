import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import { AppState } from 'types/redux.types'
import { selectVessel } from 'routes/routes.selectors'
import { setVesselInfo, VesselInfo } from 'features/vessels/vessels.slice'

// TODO to be finished when the api is ready
const fetchVesselInfo = async (id: string) => {
  const url = `/v1/vessels/${id}`
  const data: VesselInfo = await GFWAPI.fetch<any>(url).then((r) => {
    console.log('-------------- VESSEL INFO -----------------')
    console.log(r)

    return r
  })

  return data
}

// TODO to be finished when the api is ready
export const vesselInfoThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const id = selectVessel(state)
  if (!id || id === 'NA') return null

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
