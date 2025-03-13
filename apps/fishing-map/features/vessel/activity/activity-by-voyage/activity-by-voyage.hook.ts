import { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'

import { setVesselEventId } from 'features/vessel/vessel.slice'

// TODO move this to url
function useExpandedVoyages(): [number | undefined, (voyage: any) => void] {
  const [expandedVoyage, setExpandedVoyage] = useState<number>()

  const dispatch = useDispatch()

  const toggleVoyage = useCallback(
    (voyage: number) => {
      const isCurrentVoyage = expandedVoyage === voyage
      setExpandedVoyage(isCurrentVoyage ? undefined : voyage)
      dispatch(setVesselEventId(null))
    },
    [dispatch, expandedVoyage]
  )

  return [expandedVoyage, toggleVoyage]
}

export default useExpandedVoyages
