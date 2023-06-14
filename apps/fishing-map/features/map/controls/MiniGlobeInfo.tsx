import { useTranslation } from 'react-i18next'
import formatcoords from 'formatcoords'
import { useEffect, useState } from 'react'
import type {
  getOceanAreaName as getOceanAreaNameType,
  OceanAreaLocale,
} from '@globalfishingwatch/ocean-areas'
import { MapCoordinates } from 'types'
import { toFixed } from 'utils/shared'
import styles from './MapControls.module.css'

let getOceanAreaName: typeof getOceanAreaNameType | undefined
const MiniGlobeInfo = ({ viewport }: { viewport: MapCoordinates }) => {
  const { i18n } = useTranslation()
  const [oceanAreasReady, setOceanAreasready] = useState(getOceanAreaName !== undefined)
  const [showDMS, setShowDMS] = useState(true)

  useEffect(() => {
    const importGetOceanAreaName = async () => {
      getOceanAreaName = await import('@globalfishingwatch/ocean-areas').then(
        (module) => module.getOceanAreaName
      )
      setOceanAreasready(true)
    }
    if (!getOceanAreaName) {
      importGetOceanAreaName()
    }
  }, [])

  return (
    <div className={styles.miniGlobeInfo} onClick={() => setShowDMS(!showDMS)}>
      <div className={styles.miniGlobeInfoTitle}>
        {oceanAreasReady &&
          getOceanAreaName &&
          getOceanAreaName(viewport, {
            locale: i18n.language as OceanAreaLocale,
            combineWithEEZ: true,
          })}
      </div>
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
