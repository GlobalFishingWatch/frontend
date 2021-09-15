import { useCallback, useMemo, useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { DEFAULT_EMPTY_VALUE } from 'data/config'
// import { VesselAPISource } from 'types'

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
      } else {
        // TODO Display message to the user to inform the limit
        console.log('Can not select more than 3 vessels to merge')
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
