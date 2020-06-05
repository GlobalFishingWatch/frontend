import { createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store/store'
import { selectWorkspaceDataviews } from 'features/workspace/workspace.slice'
import { EditorDataview, selectDataviews } from './dataviews.slice'

export const selectCurrentDataview = (state: RootState) =>
  state.dataviews.dataviews.find((dataview: EditorDataview) => dataview.editing)

export const selectEditorDataviews = createSelector(
  [selectWorkspaceDataviews, selectDataviews],
  (workspaceDataviews, dataviews) => {
    const editorDataviews: EditorDataview[] = dataviews.map((dataview) => {
      const workspaceDataview = workspaceDataviews.find(
        (workspaceDataview) => workspaceDataview.id === dataview.id
      )
      return {
        ...dataview,
        added: workspaceDataview !== undefined,
      }
    })
    return editorDataviews
  }
)

export const selectAddedDataviews = createSelector([selectEditorDataviews], (editorDataviews) => {
  return editorDataviews.filter((dataview) => dataview.added)
})
