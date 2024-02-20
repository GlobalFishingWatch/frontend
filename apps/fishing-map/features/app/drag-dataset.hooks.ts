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
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const datasetModalOpen = selectDatasetUploadModalOpen(store.getState() as RootState)
      if (isWorkspaceLocation && !datasetModalOpen && e.dataTransfer?.types?.includes('Files')) {
        dispatchDatasetModalOpen(true)
        dispatchDatasetModalConfig({ style: 'transparent' })
      }
    },
    [dispatchDatasetModalConfig, dispatchDatasetModalOpen, store, isWorkspaceLocation]
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
    const eventsConfig: { event: keyof WindowEventMap; callback: any; listener: any }[] = [
      { event: 'dragenter', callback: onDragEnter, listener: undefined },
      { event: 'dragleave', callback: onDragLeave, listener: undefined },
      { event: 'drop', callback: onDrop, listener: undefined },
    ]

    if (typeof window !== 'undefined' && isWorkspaceLocation) {
      eventsConfig.forEach(({ event, listener, callback }) => {
        listener = window.addEventListener(event, callback)
      })
    }
    return () => {
      eventsConfig.forEach(({ event, listener }) => {
        if (listener) {
          window.removeEventListener(event, listener)
        }
      })
    }
  }, [isWorkspaceLocation, onDragEnter, onDragLeave, onDrop])
}
