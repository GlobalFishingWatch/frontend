import { useCallback, useEffect, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import type { RootState } from 'reducers'
import {
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import { selectIsWorkspaceLocation } from 'routes/routes.selectors'
import { selectDatasetUploadModalOpen } from 'features/modals/modals.slice'
import { getFileType } from 'utils/files'
import { NEW_DATASET_MODAL_ID } from 'features/datasets/upload/NewDataset'

export function useDatasetDrag() {
  const store = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const datasetModalOpen = useSelector(selectDatasetUploadModalOpen)
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()
  const [listenersAttached, setListenersAttached] = useState(false)

  const onDragEnter = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
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
      setIsDragging(false)
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

      const newDatasetModal = document.getElementById(NEW_DATASET_MODAL_ID)
      const isInDropArea = newDatasetModal?.contains(e.target as Node)
      if (!e.currentTarget || !e.dataTransfer || !isInDropArea) {
        dispatchDatasetModalOpen(false)
      }

      const isValidFile = [...(e.dataTransfer?.items || [])].some((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile()
          const fileType = file ? getFileType(file) : undefined
          return fileType !== undefined
        }
        return false
      })
      if (isValidFile) {
        dispatchDatasetModalConfig({ style: 'default' })
      }

      setIsDragging(false)
    },
    [dispatchDatasetModalConfig, dispatchDatasetModalOpen]
  )

  useEffect(() => {
    const eventsConfig: { event: keyof WindowEventMap; callback: any }[] = [
      { event: 'dragenter', callback: onDragEnter },
      { event: 'dragleave', callback: onDragLeave },
    ]

    if (
      !listenersAttached &&
      typeof window !== 'undefined' &&
      isWorkspaceLocation &&
      !datasetModalOpen
    ) {
      eventsConfig.forEach(({ event, callback }) => {
        window.addEventListener(event, callback)
      })
      setListenersAttached(true)
    }
    return () => {
      if (listenersAttached) {
        setListenersAttached(false)
        eventsConfig.forEach(({ event, callback }) => {
          if (callback) {
            window.removeEventListener(event, callback)
          }
        })
      }
    }
  }, [datasetModalOpen, isWorkspaceLocation, listenersAttached, onDragEnter, onDragLeave])

  useEffect(() => {
    if (typeof window !== 'undefined' && isDragging) {
      window.addEventListener('drop', onDrop)
    }
    return () => {
      window.removeEventListener('drop', onDrop)
    }
  }, [isDragging, onDrop])
}
