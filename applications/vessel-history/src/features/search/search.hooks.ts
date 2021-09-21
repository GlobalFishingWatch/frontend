import { useCallback, useMemo, useState } from 'react'

// Maximum number of vessels that can be merged
const LIMIT_VESSELS_MERGE_TO = 3

export const useSearchConnect = () => {
  const [selectedVessels, setSelectedVessels] = useState<number[]>([])
  const isVesselsMergeEnabled = useMemo(
    () => selectedVessels.length < LIMIT_VESSELS_MERGE_TO,
    [selectedVessels.length]
  )

  const onVesselClick = useCallback(
    (index) => () => {
      if (selectedVessels.includes(index)) {
        setSelectedVessels(selectedVessels.filter((i) => index !== i))
      } else if (isVesselsMergeEnabled) {
        setSelectedVessels([...selectedVessels, index])
      }
    },
    [isVesselsMergeEnabled, selectedVessels]
  )

  return {
    isVesselsMergeEnabled,
    selectedVessels,
    setSelectedVessels,
    onVesselClick,
  }
}
