import { useTranslation } from 'react-i18next'
import { distance as turfDistance } from '@turf/turf'

import { useMapViewport } from '../map-viewport.hooks'

import styles from './MapScaleControl.module.css'

// code from maplibre-gl-js
// https://github.com/maplibre/maplibre-gl-js/blob/d76c0447f49ddf9ea238ebe458b2488b03c0b361/src/ui/control/scale_control.ts

type ScaleControlProps = {
  maxWidth?: number
}

function getDecimalRoundNum(d: number) {
  const multiplier = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10))
  return Math.round(d * multiplier) / multiplier
}

function getRoundNum(num: number) {
  const pow10 = Math.pow(10, `${Math.floor(num)}`.length - 1)
  let d = num / pow10

  d = d >= 10 ? 10 : d >= 5 ? 5 : d >= 3 ? 3 : d >= 2 ? 2 : d >= 1 ? 1 : getDecimalRoundNum(d)

  return pow10 * d
}

const NAUTICAL_MILE_UNIT = 1852

const MapScaleControl = ({ maxWidth = 100 }: ScaleControlProps) => {
  const { t } = useTranslation()
  const mapViewport = useMapViewport()

  if (!mapViewport) {
    return null
  }

  const y = mapViewport.height / 2
  const left = mapViewport?.unproject([0, y])
  const right = mapViewport?.unproject([maxWidth, y])
  const maxMeters = turfDistance(left, right) * 1000
  const maxDistance = maxMeters / NAUTICAL_MILE_UNIT
  const distance = getRoundNum(maxDistance)
  const ratio = distance / maxDistance

  return (
    <div className={styles.scale} style={{ width: `${maxWidth * ratio}px` }}>
      {distance} {t(`map.nauticalMilesAbbr`, 'nm')}
    </div>
  )
}

export default MapScaleControl
