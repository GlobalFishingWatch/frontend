import { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'
import { Tooltip } from '@globalfishingwatch/ui-components'
import { selectVesselDataset } from 'features/vessel/vessel.selectors'
import { formatInfoField } from 'utils/info'
import VesselLink from 'features/vessel/VesselLink'
import { selectIsWorkspaceVesselLocation } from 'routes/routes.selectors'
import VesselPin, { VesselToResolve } from 'features/vessel/VesselPin'
import { getCurrentIdentityVessel } from 'features/vessel/vessel.utils'
import styles from './RelatedVessels.module.css'

const RelatedVessel = ({
  vessel,
  vesselToResolve,
  showTooltip = false,
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
  showTooltip?: boolean
}) => {
  const vesselIdentity = vessel ? getCurrentIdentityVessel(vessel) : vesselToResolve
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselDataset = useSelector(selectVesselDataset) as Dataset
  const nameLabel = formatInfoField(
    (vesselIdentity as any)?.shipname || (vesselIdentity as any)?.name || '',
    'shipname'
  )
  const flagLabel = formatInfoField(vesselIdentity?.flag || '', 'flag')
  const fullLabel = `${nameLabel} (${flagLabel})`

  return (
    <Fragment>
      {isWorkspaceVesselLocation && <VesselPin vessel={vessel} vesselToResolve={vesselToResolve} />}
      <Tooltip content={showTooltip && fullLabel.length > 30 && fullLabel}>
        <span>
          <VesselLink
            className={styles.vessel}
            vesselId={vesselIdentity?.id}
            datasetId={vesselDataset?.id}
          >
            {nameLabel}
          </VesselLink>{' '}
          <span className={styles.secondary}>({flagLabel})</span>
        </span>
      </Tooltip>
    </Fragment>
  )
}

export default RelatedVessel
