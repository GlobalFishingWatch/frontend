import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import cx from 'classnames'
import { uniq } from 'es-toolkit'
import { t } from 'i18next'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import type { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { Collapsable } from '@globalfishingwatch/ui-components'

import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getRelatedDatasetByType } from 'features/datasets/datasets.utils'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'
import {
  selectActiveActivityDataviews,
  selectActiveDetectionsDataviews,
} from 'features/dataviews/selectors/dataviews.categories.selectors'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import I18nNumber from 'features/i18n/i18nNumber'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'

import styles from 'features/workspace/shared/Sections.module.css'

const MAX_VESSLES_TO_DISPLAY = 10

type VesselFromPosition = {
  id: string
  shipname?: string
  value: number
  datasets: string[]
}

function VesselsFromPositions() {
  const [vessels, setVessels] = useState<VesselFromPosition[]>([])
  const allDatasets = useSelector(selectAllDatasets)

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
    if (fourwingsDetectionsLayer?.instance) {
      if (vessel) {
        fourwingsDetectionsLayer.instance.setHighlightedVessel(vessel.id)
      } else {
        fourwingsDetectionsLayer.instance.setHighlightedVessel(undefined)
      }
    }
  }

  const fourwingsLayers = [fourwingsActivityLayer, fourwingsDetectionsLayer].filter(Boolean)

  const fourwingsLayersLoaded =
    fourwingsLayers.length && fourwingsLayers.every((l) => l?.instance?.isLoaded)

  useEffect(() => {
    if (
      fourwingsLayersLoaded &&
      (fourwingsActivityLayer?.instance?.props.visualizationMode === 'positions' ||
        fourwingsDetectionsLayer?.instance?.props.visualizationMode === 'positions')
    ) {
      const positions = [
        ...((fourwingsActivityLayer?.instance.getViewportData() as FourwingsPositionFeature[]) ||
          []),
        ...((fourwingsDetectionsLayer?.instance.getViewportData() as FourwingsPositionFeature[]) ||
          []),
      ]
      const sublayers = fourwingsActivityLayer?.instance.getFourwingsLayers()
      const activityDatasets = uniq(sublayers?.flatMap((sublayer) => sublayer.datasets || []) || [])
      const searchDatasets = allDatasets.flatMap((dataset) => {
        if (activityDatasets.includes(dataset.id)) {
          const relatedVesselDataset = getRelatedDatasetByType(dataset, DatasetTypes.Vessels)
          return relatedVesselDataset?.id || []
        }
        return []
      })
      if (positions.length) {
        const vesselsByValue = positions.reduce((acc, position) => {
          if (position.properties.shipname) {
            if (!acc[position.properties.shipname]) {
              acc[position.properties.shipname] = {
                id: position.properties.id,
                shipname: position.properties.shipname,
                value: 0,
                datasets: searchDatasets,
              }
            }
            acc[position.properties.shipname].value += position.properties.value
          }
          return acc
        }, {} as Record<string, VesselFromPosition>)
        const vessels = Object.values(vesselsByValue).sort((a, b) => b.value - a.value)
        const vesselsNotAlreadyPinned = vessels.filter((vessel) => !vesselIds.includes(vessel.id))
        setVessels(vesselsNotAlreadyPinned || [])
      } else {
        setVessels([])
      }
    } else {
      setVessels([])
    }
  }, [fourwingsLayers.length, fourwingsLayersLoaded, vesselsHash])

  if (!vessels.length) {
    return null
  }

  return (
    <div className={cx(styles.content, 'print-hidden')}>
      <Collapsable
        label={t('vessel.onScreen', 'Vessels on screen')}
        open
        className={cx(styles.header, styles.vesselsOnScreen, 'print-hidden')}
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
              <VesselPin vesselToSearch={vessel} onClick={() => setHighlightVessel(undefined)} />
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
    </div>
  )
}

export default VesselsFromPositions
