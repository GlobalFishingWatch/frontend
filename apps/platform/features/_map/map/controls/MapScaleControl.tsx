import { useTranslation } from 'react-i18next'
import { distance as turfDistance } from '@turf/turf'

import { Tooltip } from '@globalfishingwatch/ui-components'

import useRulers from 'features/_map/map/overlays/rulers/rulers.hooks'
import type { MapScaleUnit } from 'features/_user/user.slice'

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

const UNIT_METERS: Record<MapScaleUnit, number> = {
  nm: 1852,
  km: 1000,
}

const MapScaleControl = ({ maxWidth = 100 }: ScaleControlProps) => {
  const { t } = useTranslation()
  const mapViewport = useMapViewport()
  const { unit: scaleUnit, toggleRulersUnit } = useRulers()

  if (!mapViewport) {
    return null
  }

  const y = mapViewport.height / 2
  const left = mapViewport.unproject([0, y])
  const right = mapViewport.unproject([maxWidth, y])
  const maxMeters = turfDistance(left, right) * 1000
  const maxDistance = maxMeters / UNIT_METERS[scaleUnit]
  const distance = getRoundNum(maxDistance)
  const ratio = distance / maxDistance

  const unitLabel = scaleUnit === 'nm' ? t((t) => t.map.nauticalMilesAbbr) : t((t) => t.common.km)

  return (
    <Tooltip content={t((t) => t.map.rulersUnitToggle)}>
      <button
        className={styles.scale}
        style={{ width: `${maxWidth * ratio}px` }}
        onClick={toggleRulersUnit}
      >
        {distance} {unitLabel}
      </button>
    </Tooltip>
  )
}

export default MapScaleControl
