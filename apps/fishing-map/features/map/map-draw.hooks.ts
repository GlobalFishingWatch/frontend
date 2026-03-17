import { useCallback, useMemo } from 'react'
import { useSelector } from 'react-redux'

import type { DrawFeatureType } from '@globalfishingwatch/deck-layers'

import { useReplaceQueryParams } from 'router/routes.hook'
import { selectIsMapDrawing, selectMapDrawingMode } from 'router/routes.selectors'

export const useMapDrawConnect = () => {
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const { replaceQueryParams } = useReplaceQueryParams()
  const mapDrawingMode = useSelector(selectMapDrawingMode)
  // TODO:RR review if this works
  const dispatchSetMapDrawing = useCallback(
    (mapDrawing: DrawFeatureType | false) => {
      replaceQueryParams({ mapDrawing })
    },
    [replaceQueryParams]
  )

  const dispatchSetMapDrawEditDataset = useCallback(
    (mapDrawingEditId: string) => {
      replaceQueryParams({ mapDrawingEditId })
    },
    [replaceQueryParams]
  )

  const dispatchResetMapDraw = useCallback(() => {
    replaceQueryParams({ mapDrawing: false, mapDrawingEditId: undefined })
  }, [replaceQueryParams])

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
