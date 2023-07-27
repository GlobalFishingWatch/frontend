import { useCallback, useState } from 'react'

// TODO move this to url
function useExpandedVoyages(): [number[], (voyage: any) => void] {
  const [expandedVoyages, setExpandedVoyages] = useState<number[]>([])

  const toggleVoyage = useCallback((voyage) => {
    setExpandedVoyages((voyages) => {
      const index = voyages.indexOf(voyage)
      return index === -1 ? [...voyages, voyage] : voyages.filter((v) => v !== voyage)
    })
  }, [])

  return [expandedVoyages, toggleVoyage]
}

export default useExpandedVoyages
