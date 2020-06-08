import { createSelector } from '@reduxjs/toolkit'
import { selectWorkspaceDataviews } from 'features/workspace/workspace.slice'
import { EditorDataview, selectDataviews } from './dataviews.slice'

export const selectCurrentDataview = createSelector([selectDataviews], (dataviews) => {
  const currentDataview = dataviews.find((dataview: EditorDataview) => dataview.editing)
  return currentDataview
})

// Retrieves all dataviews + whether it is currently added in the workspace or not
export const selectEditorDataviews = createSelector(
  [selectWorkspaceDataviews, selectDataviews],
  (workspaceDataviews, dataviews) => {
    const editorDataviews: EditorDataview[] = dataviews.map((dataview) => {
      const workspaceDataview = workspaceDataviews.find(
        (workspaceDataview) => workspaceDataview.editorId === dataview.editorId
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
