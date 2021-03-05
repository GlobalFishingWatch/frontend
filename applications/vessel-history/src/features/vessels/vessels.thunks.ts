import { Dispatch } from 'redux'
import { StateGetter } from 'redux-first-router'
import GFWAPI from '@globalfishingwatch/api-client'
import { AppState } from 'types/redux.types'
import {
  selectDataset,
  selectTmtId,
  selectVesselId,
  selectVesselProfileId,
} from 'routes/routes.selectors'
import { IVesselInfo, selectVessels, setVesselInfo } from 'features/vessels/vessels.slice'
import { GFWDetail, TMTDetail } from './../../types/index'

const fetchGFWData = async (id: string, dataset: string) => {
  const url = `/v1/vessels/${id}?datasets=${dataset}`
  const gfwData: GFWDetail | null = await GFWAPI.fetch<any>(url)
    .then((data: GFWDetail) => {
      return data
    })
    .catch((error) => {
      return null
    })

  return gfwData
}
const fetchTMTData = async (id: string) => {
  const url = `/v1/vessel-history/${id}`
  const tmtData: TMTDetail | null = await GFWAPI.fetch<any>(url)
    .then((data: TMTDetail) => {
      return data
    })
    .catch((error) => {
      return null
    })

  return tmtData
}
const fetchVesselInfo = async (vesselID: string, tmtID: string, dataset: string) => {
  const gfwData = vesselID && dataset ? await fetchGFWData(vesselID, dataset) : null
  const tmtData = tmtID ? await fetchTMTData(tmtID) : null

  return {
    gfwData,
    tmtData,
  } as IVesselInfo
}

// TODO to be finished when the api is ready
export const vesselInfoThunk = async (dispatch: Dispatch, getState: StateGetter<AppState>) => {
  const state = getState()
  const vesselID = selectVesselId(state)
  const tmtID = selectTmtId(state)
  const dataset = selectDataset(state)
  const id = selectVesselProfileId(state)
  const data = await fetchVesselInfo(vesselID, tmtID, dataset)
  const vessels = selectVessels(state)

  if (vessels[id]) return

  try {
    dispatch(
      setVesselInfo({
        id: id,
        data: data,
      })
    )
  } catch (e) {
    console.error(e)
  }
}
