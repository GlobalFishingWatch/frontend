import { Vessel } from '@globalfishingwatch/api-types'

export type VesselIdentityProps = {
  vessel: Vessel
}

const identityFields = ['shipname', 'flag', 'vesselType', 'gearType', 'mmsi']
const VesselIdentity = ({ vessel }: VesselIdentityProps) => {
  return (
    <ul>
      {identityFields.map((field) => (
        <li key={field}>
          {field}: {vessel[field]}
        </li>
      ))}
    </ul>
  )
}

export default VesselIdentity
