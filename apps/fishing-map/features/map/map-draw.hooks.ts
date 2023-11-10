import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { selectIsMapDrawing } from 'routes/routes.selectors'
import { useLocationConnect } from 'routes/routes.hook'

export const useMapDrawConnect = () => {
  const isMapDrawing = useSelector(selectIsMapDrawing)
  const { dispatchQueryParams } = useLocationConnect()

  const dispatchSetMapDrawing = useCallback(
    (mapDrawing: boolean) => {
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

  return {
    isMapDrawing,
    dispatchResetMapDraw,
    dispatchSetMapDrawing,
    dispatchSetMapDrawEditDataset,
  }
}
