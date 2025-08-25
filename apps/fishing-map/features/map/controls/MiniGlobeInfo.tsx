import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import formatcoords from 'formatcoords'

import type { OceanAreaLocale } from '@globalfishingwatch/ocean-areas'

import { PATH_BASENAME } from 'data/config'
import type { MapCoordinates } from 'types'
import { toFixed } from 'utils/shared'

import styles from './MapControls.module.css'

const MiniGlobeInfo = ({ viewport }: { viewport: MapCoordinates }) => {
  const { i18n } = useTranslation()
  const [showDMS, setShowDMS] = useState(true)
  const [areaName, setAreaName] = useState('')

  useEffect(() => {
    const updateAreaName = async (viewport: MapCoordinates, locale: OceanAreaLocale) => {
      try {
        const response = await fetch(`${PATH_BASENAME}/api/ocean-areas/name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...viewport,
            locale,
            combineWithEEZ: true,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          setAreaName(result.data || '')
        } else {
          console.error('Failed to get ocean area name:', response.statusText)
          setAreaName('')
        }
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
