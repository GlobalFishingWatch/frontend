import { RootState } from '../../store'

export const selectEditing = (state: RootState) => state.rulers.editing
export const selectNumRulers = (state: RootState) => state.rulers.rulers.length
export const selectRulers = (state: RootState) => state.rulers.rulers
