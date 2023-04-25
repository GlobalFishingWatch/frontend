import { Vessel } from '@globalfishingwatch/api-types'

export type VesselSummaryProps = {
  vessel: Vessel
}

const VesselSummary = ({ vessel }: VesselSummaryProps) => {
  return (
    <div>
      <h1>{vessel?.shipname}</h1>
      <h2>
        The {vessel?.vesselType} flagged by {vessel?.flag} had 312 events in 15 voyages between
        [dates]
      </h2>
    </div>
  )
}

export default VesselSummary
