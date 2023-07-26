import { useSelector } from 'react-redux'
import cx from 'classnames'
import { IconButton } from '@globalfishingwatch/ui-components'
import { eventsToBbox } from '@globalfishingwatch/data-transforms'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { selectVesselEventsFilteredByTimerange } from 'features/vessel/vessel.selectors'
import { selectVesselInfoData } from 'features/vessel/vessel.slice'
import { formatInfoField } from 'utils/info'
import VesselGroupAddButton from 'features/vessel-groups/VesselGroupAddButton'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import styles from './VesselSummary.module.css'

const VesselSummary = () => {
  const vessel = useSelector(selectVesselInfoData)
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const fitBounds = useMapFitBounds()

  const onVesselFitBoundsClick = () => {
    const bounds = eventsToBbox(events)
    fitBounds(bounds)
  }

  return (
    <div className={cx(styles.summaryContainer, styles.titleContainer)}>
      <h1 className={styles.title}>
        {formatInfoField(getVesselProperty(vessel, { property: 'shipname' }), 'name')} (
        {formatInfoField(getVesselProperty(vessel, { property: 'flag' }), 'flag')})
      </h1>
      <div className={styles.actionsContainer}>
        <IconButton
          icon="target"
          size="small"
          disabled={!events?.length}
          onClick={onVesselFitBoundsClick}
        />
        {/* TODO: get info and track datasets for vessel */}
        <VesselGroupAddButton
          buttonSize="small"
          buttonType="border-secondary"
          vessels={[vessel as any]}
          showCount={false}
        />
      </div>
    </div>
  )
}

export default VesselSummary
