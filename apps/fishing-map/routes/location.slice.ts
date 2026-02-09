import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { QueryParams } from 'types'

import type { ROUTE_TYPES } from './routes'
import { HOME } from './routes'
import type { LinkToPayload } from './routes.types'

/**
 * Location payload with index signature for backward compatibility.
 * The old redux-first-router typed payload as `object` (Record<string, any>),
 * so existing code accesses arbitrary keys without narrowing.
 */
export type LocationPayload = LinkToPayload & Record<string, string | undefined>

export interface LocationState {
  type: ROUTE_TYPES
  payload: LocationPayload
  query: QueryParams
  pathname: string
  prev?: {
    type: ROUTE_TYPES
    payload: LocationPayload
    query: QueryParams
    pathname: string
  }
  kind?: string
}

const initialState: LocationState = {
  type: HOME,
  payload: {},
  query: {} as QueryParams,
  pathname: '/',
}

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (_state, action: PayloadAction<LocationState>) => {
      return action.payload
    },
  },
})

export const { setLocation } = locationSlice.actions
export default locationSlice.reducer
