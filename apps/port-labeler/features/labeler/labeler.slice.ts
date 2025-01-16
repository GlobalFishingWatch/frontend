import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from 'store'
import type { PortPosition, PortSubarea } from 'types'

import type { SelectOption } from '@globalfishingwatch/ui-components'

interface ValuesObject {
  [key: string]: any
}
interface CountryMap {
  [key: string]: ValuesObject
}
interface CountrySelectMap {
  [key: string]: PortSubarea[]
}

export type ProjectSlice = {
  data: PortPosition[]
  portValues: CountryMap
  subareaValues: CountryMap
  pointValues: CountryMap
  country: string | null
  countryOptions: SelectOption[]
  countryColors: CountryMap
  hover: string | null
  selected: string[]
  subareas: CountrySelectMap
  ports: CountrySelectMap
  extraData: boolean
}

const initialState: ProjectSlice = {
  data: [],
  portValues: {},
  subareaValues: {},
  pointValues: {},
  countryOptions: [],
  countryColors: {},
  country: null,
  hover: null,
  selected: [],
  subareas: {},
  ports: {},
  extraData: false,
}

// This slice in in change of manage the values of the points and sort the table
const slice = createSlice({
  name: 'labeler',
  initialState,
  reducers: {
    setCountriesMetadata: (
      state,
      action: PayloadAction<{ options: SelectOption[]; colors: CountryMap }>
    ) => {
      state.countryOptions = action.payload.options
      state.countryColors = action.payload.colors
    },
    setData: (state, action: PayloadAction<PortPosition[]>) => {
      state.data = action.payload
    },
    toogleExtraData: (state, action: PayloadAction<PortPosition[]>) => {
      state.extraData = !state.extraData
    },
    setSelectedPoints: (state, action: PayloadAction<string[]>) => {
      state.selected = action.payload
    },
    setCountry: (state, action: PayloadAction<string>) => {
      state.country = action.payload
    },
    setHoverPoint: (state, action: PayloadAction<string | null>) => {
      state.hover = action.payload
    },
    setSubareas: (state, action: PayloadAction<PortSubarea[]>) => {
      state.subareas[state.country] = action.payload
    },
    setPorts: (state, action: PayloadAction<PortSubarea[]>) => {
      state.ports[state.country] = action.payload
    },
    sortOptions: (state) => {
      const portOptions = [...state.ports[state.country]]
      state.ports[state.country] = portOptions.sort((a, b) => (a.name > b.name ? 1 : -1))
      const subareaOptions = [...state.subareas[state.country]]
      state.subareas[state.country] = subareaOptions.sort((a, b) => (a.name > b.name ? 1 : -1))
    },
    setPortValues: (state, action: PayloadAction<ValuesObject>) => {
      if (!state.portValues[state.country]) state.portValues[state.country] = action.payload
    },
    setSubareaValues: (state, action: PayloadAction<ValuesObject>) => {
      if (!state.subareaValues[state.country]) state.subareaValues[state.country] = action.payload
    },
    setPointValues: (state, action: PayloadAction<ValuesObject>) => {
      if (!state.pointValues[state.country]) state.pointValues[state.country] = action.payload
    },
    changePortValue: (state, action: PayloadAction<{ id: string; value: string }>) => {
      if (state.selected && state.selected.length) {
        const newPortValues = state.portValues
        state.selected.forEach((selected) => {
          newPortValues[state.country][selected] = action.payload.value
        })
        state.portValues = newPortValues
      } else {
        state.portValues[state.country][action.payload.id] = action.payload.value
      }
      state.portValues[state.country][action.payload.id] = action.payload.value
    },
    changeSubareaValue: (state, action: PayloadAction<{ id: string; value: string }>) => {
      if (state.selected && state.selected.length) {
        const newSubareaValues = state.subareaValues
        state.selected.forEach((selected) => {
          newSubareaValues[state.country][selected] = action.payload.value
        })
        state.subareaValues = newSubareaValues
      } else {
        state.subareaValues[state.country][action.payload.id] = action.payload.value
      }
    },
    changeAnchoragePort: (state, action: PayloadAction<{ id: string; iso3: string }>) => {
      state.data = state.data.map((point) => {
        if (point.s2id === action.payload.id) {
          return {
            ...point,
            port_iso3: null,
            port_label: null,
            community_label: null,
            iso3: action.payload.iso3,
            community_iso3: null,
          }
        }
        return point
      })
    },
    changePointValue: (state, action: PayloadAction<{ id: string; value: string }>) => {
      if (state.selected && state.selected.length) {
        const newPointValues = state.pointValues
        state.selected.forEach((selected) => {
          newPointValues[state.country][selected] = action.payload.value
        })
        state.pointValues = newPointValues
      } else {
        state.pointValues[state.country][action.payload.id] = action.payload.value
      }
    },
    sortPoints: (state, action: PayloadAction<{ orderColumn: string; orderDirection: string }>) => {
      const orderColumn = action.payload.orderColumn
      const orderDirection = action.payload.orderDirection
      if (orderColumn === 'anchorage') {
        state.data = state.data.sort((a, b) => {
          if (orderDirection === 'desc') {
            return state.pointValues[a.s2id] < state.pointValues[b.s2id] ? 1 : -1
          }
          return state.pointValues[a.s2id] > state.pointValues[b.s2id] ? 1 : -1
        })
      }
      if (orderColumn === 'port') {
        state.data = state.data.sort((a, b) => {
          if (orderDirection === 'desc') {
            return state.portValues[a.s2id] < state.portValues[b.s2id] ? 1 : -1
          }
          return state.portValues[a.s2id] > state.portValues[b.s2id] ? 1 : -1
        })
      }
      if (orderColumn === 'subarea') {
        state.data = state.data.sort((a, b) => {
          if (orderDirection === 'desc') {
            return state.subareaValues[a.s2id] < state.subareaValues[b.s2id] ? 1 : -1
          }
          return state.subareaValues[a.s2id] > state.subareaValues[b.s2id] ? 1 : -1
        })
      }
      if (orderColumn === 'top_destination') {
        state.data = state.data.sort((a, b) => {
          if (orderDirection === 'desc') {
            return a.top_destination < b.top_destination ? 1 : -1
          }
          return a.top_destination > b.top_destination ? 1 : -1
        })
      }
    },
  },
})

export const {
  setData,
  setSelectedPoints,
  setCountry,
  setHoverPoint,
  setSubareas,
  setPorts,
  setPortValues,
  setSubareaValues,
  setPointValues,
  changePortValue,
  changeSubareaValue,
  changePointValue,
  sortPoints,
  sortOptions,
  toogleExtraData,
  changeAnchoragePort,
  setCountriesMetadata,
} = slice.actions

export default slice.reducer

export const selectDisplayExtraData = (state: RootState) => state.labeler.extraData
export const selectSelectedPoints = (state: RootState) => state.labeler.selected
export const selectCountry = (state: RootState) => state.labeler.country
export const selectHoverPoint = (state: RootState) => state.labeler.hover
export const selectSubareas = (state: RootState) => state.labeler.subareas
export const selectPorts = (state: RootState) => state.labeler.ports
export const selectMapData = (state: RootState) => state.labeler.data
export const selectPortValues = (state: RootState) => state.labeler.portValues
export const selectSubareaValues = (state: RootState) => state.labeler.subareaValues
export const selectPointValues = (state: RootState) => state.labeler.pointValues
export const selectCountries = (state: RootState) => state.labeler.countryOptions
export const selectCountryColors = (state: RootState) => state.labeler.countryColors
