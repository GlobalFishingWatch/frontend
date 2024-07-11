import { useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { t } from 'i18next'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { Collapsable } from '@globalfishingwatch/ui-components'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import I18nNumber from 'features/i18n/i18nNumber'

const MAX_VESSLES_TO_DISPLAY = 10

type VesselFromPosition = {
  id: string
  shipname?: string
  value: number
}

function VesselsFromPositions() {
  const [vessels, setVessels] = useState<VesselFromPosition[]>([])

  const vesselDataviews = useSelector(selectVesselsDataviews)
  const vesselIds = vesselDataviews?.flatMap(
    (dataview) => dataview.id.split(VESSEL_LAYER_PREFIX)[1] || []
  )
  const vesselsHash = vesselIds.join(',')

  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const detectionsDataviews = useSelector(selectActiveDetectionsDataviews)
  const activityId = activityDataviews?.length ? getMergedDataviewId(activityDataviews) : ''
  const detectionsId = detectionsDataviews?.length ? getMergedDataviewId(detectionsDataviews) : ''
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(activityId)
  const fourwingsDetectionsLayer = useGetDeckLayer<FourwingsLayer>(detectionsId)

  const setHighlightVessel = (vessel: VesselFromPosition | undefined) => {
    if (fourwingsActivityLayer?.instance) {
      if (vessel) {
        fourwingsActivityLayer.instance.setHighlightedVessel(vessel.id)
      } else {
        fourwingsActivityLayer.instance.setHighlightedVessel(undefined)
      }
    }
  }

  const fourwingsLayers = [fourwingsActivityLayer, fourwingsDetectionsLayer].filter(Boolean)

  const fourwingsLayersLoaded =
    fourwingsLayers.length && fourwingsLayers.every((l) => l?.instance?.isLoaded)

  useEffect(() => {
    if (
      fourwingsLayersLoaded &&
      fourwingsActivityLayer?.instance?.props.visualizationMode === 'positions'
    ) {
      const positions = [
        ...((fourwingsActivityLayer?.instance.getViewportData() as FourwingsPositionFeature[]) ||
          []),
        ...((fourwingsDetectionsLayer?.instance.getViewportData() as FourwingsPositionFeature[]) ||
          []),
      ]
      if (positions.length) {
        const vesselsByValue = positions.reduce((acc, position) => {
          if (position.properties.shipname) {
            if (!acc[position.properties.shipname]) {
              acc[position.properties.shipname] = {
                id: position.properties.id,
                shipname: position.properties.shipname,
                value: 0,
              }
            }
            acc[position.properties.shipname].value += position.properties.value
          }
          return acc
        }, {} as Record<string, VesselFromPosition>)
        const vesselsArray = Object.values(vesselsByValue).sort((a, b) => b.value - a.value)
        setVessels(vesselsArray || [])
      } else {
        setVessels([])
      }
    }
    if (!fourwingsLayers.length) {
      setVessels([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsLayers.length, fourwingsLayersLoaded, vesselsHash])

  if (!vessels.length) {
    return null
  }

  return (
    <Collapsable
      label={t('vessel.onScreen', 'Vessels on screen')}
      open
      className={cx(styles.header, styles.vesselsOnScreen)}
    >
      <ul>
        {(vessels.length > MAX_VESSLES_TO_DISPLAY
          ? vessels.slice(0, MAX_VESSLES_TO_DISPLAY)
          : vessels
        ).map((vessel, index) => (
          <li
            className={styles.row}
            key={vessel.id}
            onMouseEnter={() => setHighlightVessel(vessel)}
            onMouseLeave={() => setHighlightVessel(undefined)}
          >
            <VesselPin vesselToResolve={vessel} onClick={() => setHighlightVessel(undefined)} />
            <div className={styles.vesselOnScreen}>
              <span>{formatInfoField(vessel.shipname, 'shipname')} </span>
              {fourwingsActivityLayer?.instance && !fourwingsDetectionsLayer?.instance && (
                <span>
                  <I18nNumber number={Math.round(vessel.value)} />{' '}
                  {index === 0 && ` ${t('common.hour_other', 'hours')}`}
                </span>
              )}
              {fourwingsDetectionsLayer?.instance && !fourwingsActivityLayer?.instance && (
                <span>
                  <I18nNumber number={Math.round(vessel.value)} />{' '}
                  {index === 0 && ` ${t('common.detection_other', 'detections').toLowerCase()}`}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      {vessels.length > MAX_VESSLES_TO_DISPLAY && (
        <span className={styles.moreVesselsOnScreen}>
          + {vessels.length - MAX_VESSLES_TO_DISPLAY} {t('common.more', 'more')}
        </span>
      )}
    </Collapsable>
  )
}

export default VesselsFromPositions
