import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { Ruler } from '@globalfishingwatch/layer-composer'

type RulersSlice = {
  visible: boolean
  editing: boolean
  drawing: boolean
  rulers: Ruler[]
}

const initialState: RulersSlice = {
  visible: false,
  editing: false,
  drawing: false,
  rulers: [],
}

const slice = createSlice({
  name: 'rulers',
  initialState,
  reducers: {
    editRuler: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      if (!state.editing) {
        return
      }
      if (state.drawing) {
        const lastIndex = state.rulers.length - 1
        state.rulers[lastIndex].isNew = true
        state.drawing = false
        state.visible = true
        return
      }
      const newRuler: Ruler = {
        start: {
          longitude: action.payload.longitude,
          latitude: action.payload.latitude,
        },
        end: {
          longitude: action.payload.longitude + 0.000001,
          latitude: action.payload.latitude + 0.000001,
        },
        isNew: true,
      }
      state.drawing = true
      state.visible = true
      state.rulers.push(newRuler)
    },
    moveCurrentRuler: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      if (!state.drawing || !state.editing || !state.rulers.length) {
        return
      }
      const lastIndex = state.rulers.length - 1
      state.rulers[lastIndex].end.longitude = action.payload.longitude
      state.rulers[lastIndex].end.latitude = action.payload.latitude
    },
    toggleRulersEditing: (state) => {
      state.editing = !state.editing
    },
    setRulersEditing: (state, action) => {
      state.editing = action.payload
    },
    resetRulers: (state) => {
      state.visible = false
      state.drawing = false
      state.rulers = []
    },
  },
})

export const { editRuler, moveCurrentRuler, toggleRulersEditing, setRulersEditing, resetRulers } =
  slice.actions

export const selectEditing = (state: RootState) => state.rulers.editing
export const selectNumRulers = (state: RootState) => state.rulers.rulers.length
export const selectRulers = (state: RootState) => state.rulers.rulers

export default slice.reducer
