import { merge } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'

import type { RootState } from 'reducers'
import type { QueryParams } from 'types'

import { TEST_END_DATE } from '../../setup/config'

import { REDUX_STORE_DEFAULT_STATE } from './state'

type DefaultState = typeof REDUX_STORE_DEFAULT_STATE
type DatasetsState = DefaultState['datasets']
type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

/**
 * This fixture is handed to `makeStore` as `preloadedState`, and redux@5 *silently* discards keys with
 * no registered reducer (dev-only console warning). Lazily-injected slices are optional in RootState,
 * so `keyof RootState` would happily accept one — the required keys are exactly the eagerly registered
 * ones, which is what we need to constrain against.
 *
 * A fixture key that stops being eager (or never was) is a compile error here instead of state that
 * evaporates at INIT in ~60 specs.
 */
type EagerSliceName = {
  // Pick preserves the optional modifier, so this tests the `?` rather than the value type. An
  // `undefined extends RootState[K]` test would misread the RTKQ slices, whose state is `any`.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [K in keyof RootState]-?: {} extends Pick<RootState, K> ? never : K
}[keyof RootState]

/** Constraint violated by a non-never default = compile error naming the offending key. */
type _FixtureKeysAreEager<Extra extends never = Exclude<keyof DefaultState, EagerSliceName>> = Extra

export function getDefaultState(override?: DeepPartial<DefaultState>): DefaultState {
  const state = override ? merge(REDUX_STORE_DEFAULT_STATE, override) : REDUX_STORE_DEFAULT_STATE
  const workspaceData = {
    ...state.workspace.data,
    endAt: TEST_END_DATE,
  }

  return {
    ...state,
    workspace: {
      ...state.workspace,
      data: workspaceData,
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

const getDefaultViewportProperty = (property: 'latitude' | 'longitude' | 'zoom') => {
  return (
    ((defaultState.location.query as QueryParams)[property] as number) ||
    (defaultState.workspace.data.viewport[property] as number)
  )
}

export const defaultViewport = {
  latitude: getDefaultViewportProperty('latitude'),
  longitude: getDefaultViewportProperty('longitude'),
  zoom: getDefaultViewportProperty('zoom'),
}
