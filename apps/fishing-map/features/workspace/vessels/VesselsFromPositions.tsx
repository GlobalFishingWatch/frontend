import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { uniqBy } from 'lodash'
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

function VesselsFromPositions() {
  const [vessels, setVessels] = useState<{ id: string; shipname: string }[]>([])

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
        const vessels = uniqBy(positions, 'properties.id').flatMap((position) => {
          if (!vesselIds?.includes(position.properties.id)) {
            return {
              id: position.properties.id,
              shipname: position.properties.shipname,
            }
          }
          return []
        })
        setVessels(vessels)
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
    <Collapsable label={t('vessel.onScreen', 'Vessels on screen')} open className={styles.header}>
      <ul>
        {vessels.map((vessel) => (
          <li
            className={styles.row}
            key={vessel.id}
            onMouseEnter={() => setHighlightVessel(vessel)}
            onMouseLeave={() => setHighlightVessel(undefined)}
          >
            <VesselPin vesselToResolve={vessel} onClick={() => setHighlightVessel(undefined)} />
            <span className={styles.secondary}>{formatInfoField(vessel.shipname, 'shipname')}</span>
          </li>
        ))}
      </ul>
    </Collapsable>
  )
}

export default VesselsFromPositions
