import { useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'features/app/app.hooks'
import { RenderedVoyage } from 'types/voyage'
import { upsertVesselVoyagesExpanded, selectExpandedVoyages } from './activity-by-voyage.slice'

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
