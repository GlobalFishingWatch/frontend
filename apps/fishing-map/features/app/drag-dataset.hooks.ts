import { useCallback, useEffect } from 'react'
import { useSelector, useStore } from 'react-redux'
import { RootState } from 'reducers'
import {
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import { selectIsWorkspaceLocation } from 'routes/routes.selectors'
import {
  selectDatasetUploadModalConfig,
  selectDatasetUploadModalOpen,
} from 'features/modals/modals.slice'

export function useDatasetDrag() {
  const store = useStore()
  const workspaceLocation = useSelector(selectIsWorkspaceLocation)
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const datasetModalOpen = selectDatasetUploadModalOpen(store.getState() as RootState)
      if (workspaceLocation && !datasetModalOpen) {
        dispatchDatasetModalOpen(true)
        dispatchDatasetModalConfig({ style: 'transparent' })
      }
    },
    [dispatchDatasetModalConfig, dispatchDatasetModalOpen, store, workspaceLocation]
  )

  const onDragLeave = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (!(e as any).fromElement) {
        dispatchDatasetModalOpen(false)
        dispatchDatasetModalConfig({ style: 'default' })
      }
    },
    [dispatchDatasetModalConfig, dispatchDatasetModalOpen]
  )

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const { type, fileRejected } = selectDatasetUploadModalConfig(store.getState() as RootState)
      if (!e.currentTarget || (!type && !fileRejected)) {
        dispatchDatasetModalOpen(false)
      }
      if (type) {
        dispatchDatasetModalConfig({ style: 'default' })
      }
    },
    [dispatchDatasetModalConfig, dispatchDatasetModalOpen, store]
  )

  useEffect(() => {
    let dragEnterListener: any
    let dragLeaveListener: any
    let dragEndListener: any
    if (typeof window !== 'undefined') {
      dragEnterListener = window.addEventListener('dragenter', onDragEnter)
      dragLeaveListener = window.addEventListener('dragleave', onDragLeave)
      dragEndListener = window.addEventListener('drop', onDrop)
    }
    return () => {
      if (dragEnterListener) {
        window.removeEventListener('dragover', dragEnterListener)
      }
      if (dragLeaveListener) {
        window.removeEventListener('dragleave', dragLeaveListener)
      }
      if (dragEndListener) {
        window.removeEventListener('dragend', dragEndListener)
      }
    }
  }, [onDrop, onDragEnter, onDragLeave])
}
