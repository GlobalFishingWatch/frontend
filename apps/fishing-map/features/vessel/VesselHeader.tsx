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
import { selectActiveVesselsDataviews } from 'features/dataviews/dataviews.slice'
import { COLOR_PRIMARY_BLUE } from 'features/app/App'
import styles from './VesselHeader.module.css'

const VesselHeader = () => {
  const vessel = useSelector(selectVesselInfoData)
  const dataviews = useSelector(selectActiveVesselsDataviews)
  const vesselDataview = dataviews.find(
    ({ id }) => vessel && id.includes(vessel.selfReportedInfo.id)
  )
  const events = useSelector(selectVesselEventsFilteredByTimerange)
  const fitBounds = useMapFitBounds()

  const onVesselFitBoundsClick = () => {
    const bounds = eventsToBbox(events)
    fitBounds(bounds)
  }

  return (
    <div className={cx(styles.summaryContainer, styles.titleContainer)}>
      <h1 className={styles.title}>
        <svg className={styles.vesselIcon} width="16" height="16">
          <path
            fill={vesselDataview?.config?.color || COLOR_PRIMARY_BLUE}
            stroke={COLOR_PRIMARY_BLUE}
            strokeOpacity=".5"
            d="M15.23.75v6.36l-7.8 7.8-1.58-4.78-4.78-1.59L8.87.75h6.36Z"
          />
        </svg>
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

export default VesselHeader
