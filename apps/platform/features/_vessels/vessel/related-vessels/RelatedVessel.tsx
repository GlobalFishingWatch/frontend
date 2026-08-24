import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { Dataset, IdentityVessel } from '@globalfishingwatch/api-types'

import { selectVesselDataset } from 'features/_vessels/vessel/selectors/vessel.resources.selectors'
import { getCurrentIdentityVessel } from 'features/_vessels/vessel/vessel.utils'
import type { VesselToResolve } from 'features/_vessels/vessel/vessel-pin.hooks'
import VesselLink from 'features/_vessels/vessel/VesselLink'
import VesselPin from 'features/_vessels/vessel/VesselPin'
import { selectIsWorkspaceVesselLocation } from 'router/routes.selectors'
import { formatInfoField } from 'utils/info'

import styles from './RelatedVessels.module.css'

const RelatedVessel = ({
  vessel,
  vesselToResolve,
}: {
  vessel?: IdentityVessel
  vesselToResolve?: VesselToResolve
}) => {
  const { t } = useTranslation()
  const vesselIdentity = vessel ? getCurrentIdentityVessel(vessel) : vesselToResolve
  const isWorkspaceVesselLocation = useSelector(selectIsWorkspaceVesselLocation)
  const vesselDataset = useSelector(selectVesselDataset) as Dataset
  const nameLabel = formatInfoField(
    (vesselIdentity as any)?.shipname || (vesselIdentity as any)?.name || '',
    'shipname'
  )
  const flagLabel = formatInfoField(vesselIdentity?.flag || '', 'flag')
  const fullLabel = `${nameLabel} (${flagLabel})`
  const lengthComparison = isWorkspaceVesselLocation ? 25 : 35
  const tooltip =
    fullLabel?.length > lengthComparison
      ? [fullLabel, <br />, t((t) => t.vessel.clickToSeeMore)]
      : ''

  return (
    <Fragment>
      {isWorkspaceVesselLocation && (
        <VesselPin vessel={vessel} vesselToResolve={vesselToResolve} origin="vesselProfile" />
      )}
      <VesselLink
        className={styles.vessel}
        vesselId={vesselIdentity?.id}
        datasetId={vesselDataset?.id}
        tooltip={tooltip}
        fitBounds
      >
        {nameLabel}
      </VesselLink>{' '}
      <span className={styles.secondary}>({flagLabel})</span>
    </Fragment>
  )
}

export default RelatedVessel
