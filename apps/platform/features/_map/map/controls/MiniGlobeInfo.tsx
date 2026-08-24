import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import formatcoords from 'formatcoords'

import type { OceanAreaLocale } from '@globalfishingwatch/ocean-areas'

import { useOceanAreas } from 'hooks/ocean-areas'
import type { MapCoordinates } from 'types'
import { toFixed } from 'utils/shared'

import styles from './MapControls.module.css'

const MiniGlobeInfo = ({ viewport }: { viewport: MapCoordinates }) => {
  const { i18n } = useTranslation()
  const [showDMS, setShowDMS] = useState(true)
  const [areaName, setAreaName] = useState('')
  const { getOceanAreaName } = useOceanAreas()

  useEffect(() => {
    const updateAreaName = async (viewport: MapCoordinates, locale: OceanAreaLocale) => {
      try {
        const areaName = await getOceanAreaName({
          viewport: {
            latitude: viewport.latitude,
            longitude: viewport.longitude,
            zoom: viewport.zoom,
          },
          locale,
          combineWithEEZ: true,
        })
        setAreaName(areaName || '')
      } catch (error) {
        console.error('Error getting ocean area name:', error)
        setAreaName('')
      }
    }
    updateAreaName(viewport, i18n.language as OceanAreaLocale)
  }, [i18n.language, viewport])

  return (
    <div className={styles.miniGlobeInfo} onClick={() => setShowDMS(!showDMS)}>
      <div className={styles.miniGlobeInfoTitle}>{areaName}</div>
      <div>
        {showDMS
          ? formatcoords(viewport.latitude, viewport.longitude).format('DDMMssX', {
              latLonSeparator: ' ',
              decimalPlaces: 2,
            })
          : `${toFixed(viewport.latitude, 4)},${toFixed(viewport.longitude, 4)}`}
      </div>
    </div>
  )
}
export default MiniGlobeInfo
