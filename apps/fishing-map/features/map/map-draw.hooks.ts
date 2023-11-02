import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { useLocationConnect } from 'routes/routes.hook'
import { selectSidebarOpen } from 'features/app/app.selectors'
import {
  resetMapDraw,
  selectIsMapDrawing,
  setMapDrawEditDatasetId,
  setMapDrawing,
} from './map.slice'

export const useMapDrawConnect = () => {
  const dispatch = useAppDispatch()
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const { dispatchQueryParams } = useLocationConnect()
  const sidebarOpen = useSelector(selectSidebarOpen)

  const dispatchSetMapDrawing = useCallback(
    (mode: boolean) => {
      dispatch(setMapDrawing(mode))
      if (mode === true && sidebarOpen) {
        dispatchQueryParams({ sidebarOpen: false })
      }
    },
    [dispatch, dispatchQueryParams, sidebarOpen]
  )

  const dispatchSetMapDrawEditDataset = useCallback(
    (datasetId: string) => {
      dispatch(setMapDrawEditDatasetId(datasetId))
    },
    [dispatch]
  )

  const dispatchResetMapDraw = useCallback(() => {
    dispatch(resetMapDraw())
    if (!sidebarOpen) {
      dispatchQueryParams({ sidebarOpen: true })
    }
  }, [dispatch, dispatchQueryParams, sidebarOpen])

  return {
    isMapDrawing,
    dispatchResetMapDraw,
    dispatchSetMapDrawing,
    dispatchSetMapDrawEditDataset,
  }
}
