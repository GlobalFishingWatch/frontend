import { RootState } from 'store/store'

export const selectAddedDataviews = (state: RootState) =>
  state.dataviews.filter((dataview) => dataview.added)
export const selectCurrentDataview = (state: RootState) =>
  state.dataviews.find((dataview) => dataview.editing)
