import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { PortPosition, PortSubarea } from 'types'

export type ProjectSlice = {
  data: PortPosition[]
  portValues: any
  subareaValues: any
  country: string | null
  hover: string | null
  selected: string[]
  subareas: PortSubarea[]
  ports: string[]
}

const initialState: ProjectSlice = {
  data: [],
  portValues: [],
  subareaValues: [],
  country: null,
  hover: null,
  selected: [],
  subareas: [],
  ports: [],
}

const slice = createSlice({
  name: 'labeler',
  initialState,
  reducers: {
    setData: (state, action: PayloadAction<PortPosition[]>) => {
      state.data = action.payload
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
      state.subareas = action.payload
    },
    setPorts: (state, action: PayloadAction<string[]>) => {
      state.ports = action.payload
    },
    setPortValues: (state, action: PayloadAction<any>) => {
      state.portValues = action.payload
    },
    setSubareaValues: (state, action: PayloadAction<any>) => {
      state.subareaValues = action.payload
    },
    changePortValue: (state, action: PayloadAction<{ id: string, value: string }>) => {
      if (state.selected && state.selected.length) {
        const newSubareaValues = state.portValues
        state.selected.forEach(selected => {
          newSubareaValues[selected] = action.payload.value
        })
        state.portValues = newSubareaValues
      } else {
        state.portValues[action.payload.id] = action.payload.value
      }
      state.portValues[action.payload.id] = action.payload.value
    },
    changeSubareaValue: (state, action: PayloadAction<{ id: string, value: string }>) => {
      if (state.selected && state.selected.length) {
        const newSubareaValues = state.subareaValues
        state.selected.forEach(selected => {
          newSubareaValues[selected] = action.payload.value
        })
        state.subareaValues = newSubareaValues
      } else {
        state.subareaValues[action.payload.id] = action.payload.value
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
  changePortValue,
  changeSubareaValue
} = slice.actions

export default slice.reducer

export const selectSelectedPoints = (state: RootState) => state.labeler.selected
export const selectCountry = (state: RootState) => state.labeler.country
export const selectHoverPoint = (state: RootState) => state.labeler.hover
export const selectSubareas = (state: RootState) => state.labeler.subareas
export const selectPorts = (state: RootState) => state.labeler.ports
export const selectMapData = (state: RootState) => state.labeler.data
export const selectSubareaValues = (state: RootState) => state.labeler.subareaValues
export const selectPortValues = (state: RootState) => state.labeler.portValues
