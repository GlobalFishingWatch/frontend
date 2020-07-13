import { createSelector } from '@reduxjs/toolkit'
import { selectCurrentWorkspaceDataviews } from 'features/workspace/workspace.slice'
import { EditorDataview, selectDataviews } from './dataviews.slice'

// Retrieves all dataviews + whether it is currently added in the workspace or not
export const selectEditorDataviews = createSelector(
  [selectCurrentWorkspaceDataviews, selectDataviews],
  (workspaceDataviews, dataviews) => {
    const editorDataviews: EditorDataview[] = dataviews.map((dataview) => {
      const workspaceDataview = (workspaceDataviews || []).find(
        (workspaceDataview) => workspaceDataview.id === dataview.editorId
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
