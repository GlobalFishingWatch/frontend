import { useCallback, useEffect, useState } from 'react'
import { useSelector, useStore } from 'react-redux'
import type { RootState } from 'reducers'

import {
  useDatasetModalConfigConnect,
  useDatasetModalOpenConnect,
} from 'features/datasets/datasets.hook'
import { NEW_DATASET_MODAL_ID } from 'features/datasets/upload/NewDataset'
import { selectDatasetUploadModalOpen } from 'features/modals/modals.slice'
import { selectIsWorkspaceLocation } from 'routes/routes.selectors'
import { getFileType } from 'utils/files'

export function useDatasetDrag() {
  const store = useStore()
  const [isDragging, setIsDragging] = useState(false)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const datasetModalOpen = useSelector(selectDatasetUploadModalOpen)
  const { dispatchDatasetModalOpen } = useDatasetModalOpenConnect()
  const { dispatchDatasetModalConfig } = useDatasetModalConfigConnect()

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
      if (!(e as any).fromElement) {
        setIsDragging(false)
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
    ]
    if (typeof window !== 'undefined' && isWorkspaceLocation && !datasetModalOpen) {
      eventsConfig.forEach(({ event, callback }) => {
        window.addEventListener(event, callback)
      })
    }
    return () => {
      eventsConfig.forEach(({ event, callback }) => {
        if (callback) {
          window.removeEventListener(event, callback)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetModalOpen, isWorkspaceLocation])

  useEffect(() => {
    const eventsConfig: { event: keyof WindowEventMap; callback: any }[] = [
      { event: 'drop', callback: onDrop },
      { event: 'dragleave', callback: onDragLeave },
    ]
    if (typeof window !== 'undefined' && isDragging) {
      eventsConfig.forEach(({ event, callback }) => {
        window.addEventListener(event, callback)
      })
    }
    return () => {
      if (isDragging) {
        eventsConfig.forEach(({ event, callback }) => {
          if (callback) {
            window.removeEventListener(event, callback)
          }
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])
}
