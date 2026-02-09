import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'

import { replaceQueryParams } from 'routes/routes.actions'
import { selectIsMapDrawing, selectMapDrawingMode } from 'routes/routes.selectors'

export const useMapDrawConnect = () => {
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const mapDrawingMode = useSelector(selectMapDrawingMode)
  // TODO:RR review if this works
  const dispatchSetMapDrawing = useCallback((mapDrawing: DrawFeatureType | false) => {
    replaceQueryParams({ mapDrawing })
  }, [])

  const dispatchSetMapDrawEditDataset = useCallback((mapDrawingEditId: string) => {
    replaceQueryParams({ mapDrawingEditId })
  }, [])

  const dispatchResetMapDraw = useCallback(() => {
    replaceQueryParams({ mapDrawing: false, mapDrawingEditId: undefined })
  }, [])

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
