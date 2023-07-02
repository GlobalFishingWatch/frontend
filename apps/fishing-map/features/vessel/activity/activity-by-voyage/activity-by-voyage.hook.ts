import { useCallback } from 'react'
import { useAppDispatch } from 'features/app/app.hooks'
import { RenderedVoyage } from 'types/voyage'
import { upsertVesselVoyagesExpanded } from './activity-by-voyage.slice'

function useVoyagesConnect() {
  const dispatch = useAppDispatch()

  const toggleVoyage = useCallback(
    (voyage: RenderedVoyage) => {
      dispatch(upsertVesselVoyagesExpanded(voyage))
    },
    [dispatch]
  )

  return {
    toggleVoyage,
  }
}

export default useVoyagesConnect
