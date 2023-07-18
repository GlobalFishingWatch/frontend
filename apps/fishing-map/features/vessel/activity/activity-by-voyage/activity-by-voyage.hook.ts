import { useCallback, useState } from 'react'
import { RenderedVoyage } from 'features/vessel/activity/activity-by-voyage/activity-by-voyage.selectors'

function useExpandedVoyages(): [number[], (voyage: RenderedVoyage) => void] {
  const [expandedVoyages, setExpandedVoyages] = useState<number[]>([])

  const toggleVoyage = useCallback((voyage: RenderedVoyage) => {
    setExpandedVoyages((voyages) => {
      const index = voyages.indexOf(voyage.timestamp)
      return index === -1
        ? [...voyages, voyage.timestamp]
        : voyages.filter((v) => v !== voyage.timestamp)
    })
  }, [])

  return [expandedVoyages, toggleVoyage]
}

export default useExpandedVoyages
