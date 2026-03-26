import { merge } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'

import { TEST_END_DATE } from '../../test.config'

import { REDUX_STORE_DEFAULT_STATE } from './redux-store-test.state'

type DefaultState = typeof REDUX_STORE_DEFAULT_STATE
type DatasetsState = DefaultState['datasets']
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

export function getDefaultState(override?: DeepPartial<DefaultState>): DefaultState {
  const state = override ? merge(REDUX_STORE_DEFAULT_STATE, override) : REDUX_STORE_DEFAULT_STATE
  return {
    ...state,
    workspace: {
      ...state.workspace,
      data: {
        ...state.workspace.data,
        endAt: TEST_END_DATE,
      },
    },
  }
}

export function getDefaultStateWithDatasets(
  datasets: Dataset[],
  state: DefaultState = getDefaultState()
): DefaultState {
  const newEntities = Object.fromEntries(
    datasets.map((d) => [d.id, d])
  ) as unknown as DatasetsState['entities']

  return {
    ...state,
    datasets: {
      ...state.datasets,
      ids: [...state.datasets.ids, ...datasets.map((d) => d.id)],
      entities: {
        ...state.datasets.entities,
        ...newEntities,
      },
    },
  }
}

export const defaultState = getDefaultState()
