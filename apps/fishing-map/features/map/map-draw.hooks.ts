import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'

import { useLocationConnect } from 'routes/routes.hook'
import { selectIsMapDrawing, selectMapDrawingMode } from 'routes/routes.selectors'

export const useMapDrawConnect = () => {
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const mapDrawingMode = useSelector(selectMapDrawingMode)
  const { dispatchQueryParams } = useLocationConnect()

  const dispatchSetMapDrawing = useCallback(
    (mapDrawing: DrawFeatureType | false) => {
      dispatchQueryParams({ mapDrawing })
    },
    [dispatchQueryParams]
  )

  const dispatchSetMapDrawEditDataset = useCallback(
    (mapDrawingEditId: string) => {
      dispatchQueryParams({ mapDrawingEditId })
    },
    [dispatchQueryParams]
  )

  const dispatchResetMapDraw = useCallback(() => {
    dispatchQueryParams({ mapDrawing: false, mapDrawingEditId: undefined })
  }, [dispatchQueryParams])

  return useMemo(
    () => ({
      isMapDrawing,
      mapDrawingMode,
      dispatchResetMapDraw,
      dispatchSetMapDrawing,
      dispatchSetMapDrawEditDataset,
    }),
    [
      dispatchResetMapDraw,
      dispatchSetMapDrawEditDataset,
      dispatchSetMapDrawing,
      isMapDrawing,
      mapDrawingMode,
    ]
  )
}
