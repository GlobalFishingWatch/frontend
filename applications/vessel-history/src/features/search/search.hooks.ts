import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DEFAULT_EMPTY_VALUE } from 'data/config'
import { VesselAPISource } from 'types'

export const useSearchConnect = () => {
  const [selectedVessels, setSelectedVessels] = useState<string[]>([])
  return {
    selectedVessels,
    setSelectedVessels,
  }
}
