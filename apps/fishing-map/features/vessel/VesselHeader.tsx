import { Fragment } from 'react'
import { Vessel } from '@globalfishingwatch/api-types'
import VesselSummary from 'features/vessel/VesselSummary'

export type VesselHeaderProps = {
  vessel: Vessel
}

const VesselHeader = ({ vessel }: VesselHeaderProps) => {
  return (
    <Fragment>
      <VesselSummary vessel={vessel} />
    </Fragment>
  )
}

export default VesselHeader
