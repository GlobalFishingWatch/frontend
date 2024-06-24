import { useEffect, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { t } from 'i18next'
import { getMergedDataviewId } from '@globalfishingwatch/dataviews-client'
import { useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import { FourwingsLayer } from '@globalfishingwatch/deck-layers'
import { FourwingsPositionFeature } from '@globalfishingwatch/deck-loaders'
import { Collapsable } from '@globalfishingwatch/ui-components'
import { selectActiveActivityDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import styles from 'features/workspace/shared/Sections.module.css'
import VesselPin from 'features/vessel/VesselPin'
import { formatInfoField } from 'utils/info'
import { selectVesselsDataviews } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { VESSEL_LAYER_PREFIX } from 'features/dataviews/dataviews.utils'

const MAX_VESSLES_TO_DISPLAY = 10

function VesselsFromPositions() {
  const [vessels, setVessels] = useState<{ id: string; shipname: string; value: number }[]>([])

  const vesselDataviews = useSelector(selectVesselsDataviews)
  const vesselIds = vesselDataviews?.flatMap(
    (dataview) => dataview.id.split(VESSEL_LAYER_PREFIX)[1] || []
  )
  const vesselsHash = vesselIds.join(',')

  const activityDataviews = useSelector(selectActiveActivityDataviews)
  const id = activityDataviews?.length ? getMergedDataviewId(activityDataviews) : ''
  const fourwingsActivityLayer = useGetDeckLayer<FourwingsLayer>(id)

  const setHighlightVessel = (vessel: { id: string; shipname: string } | undefined) => {
    if (fourwingsActivityLayer?.instance) {
      if (vessel) {
        fourwingsActivityLayer.instance.setHighlightedVessel(vessel.id)
      } else {
        fourwingsActivityLayer.instance.setHighlightedVessel(undefined)
      }
    }
  }

  useEffect(() => {
    if (fourwingsActivityLayer?.instance) {
      if (fourwingsActivityLayer.instance.getMode() === 'positions') {
        const positions =
          fourwingsActivityLayer.instance.getViewportData() as FourwingsPositionFeature[]
        const vesselsByValue = positions.reduce((acc, position) => {
          if (!position.properties.id) return acc
          if (!acc[position.properties.id]) {
            acc[position.properties.id] = {
              id: position.properties.id,
              shipname: position.properties.shipname,
              value: 0,
            }
          }
          acc[position.properties.id].value += position.properties.value
          return acc
        }, {} as Record<string, { id: string; shipname: string; value: number }>)
        const vesselsArray = Object.values(vesselsByValue).sort((a, b) => b.value - a.value)
        setVessels(vesselsArray || [])
      } else if (vessels?.length) {
        setVessels([])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fourwingsActivityLayer, vesselsHash])

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
              <span>
                {Math.round(vessel.value)} {index === 0 && ` ${t('common.hour_other', 'hours')}`}
              </span>
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
