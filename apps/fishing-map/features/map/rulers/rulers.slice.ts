import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'reducers'
import { Ruler } from '@globalfishingwatch/layer-composer'

type RulersSlice = {
  editing: boolean
  ruler: Partial<Ruler> | null
}

const initialState: RulersSlice = {
  editing: false,
  ruler: null,
}

const slice = createSlice({
  name: 'rulers',
  initialState,
  reducers: {
    setRuleStart: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      state.ruler = {
        isNew: true,
        start: {
          longitude: action.payload.longitude,
          latitude: action.payload.latitude,
        },
      }
    },
    setRuleEnd: (state, action: PayloadAction<{ latitude: number; longitude: number }>) => {
      if (!state.editing || !state.ruler?.start) {
        return
      }
      state.ruler.end = {
        longitude: action.payload.longitude,
        latitude: action.payload.latitude,
      }
    },
    toggleRulersEditing: (state) => {
      state.editing = !state.editing
    },
    setRulersEditing: (state, action) => {
      state.editing = action.payload
    },
    resetEditingRule: (state) => {
      state.ruler = null
    },
  },
})

export const { setRuleStart, setRuleEnd, toggleRulersEditing, setRulersEditing, resetEditingRule } =
  slice.actions

export const selectEditing = (state: RootState) => state.rulers.editing
export const selectEditingRuler = (state: RootState) => state.rulers.ruler as Ruler

export default slice.reducer
