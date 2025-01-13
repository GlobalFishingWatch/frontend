import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'
import { getVesselShipTypeLabel } from 'utils/info'
import { formatInfoField } from 'utils/info'
import type { VesselGroupVesselTableParsed } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'

const VesselGroupReportVesselsIndividualTooltip = ({
  data,
}: {
  data?: VesselGroupVesselTableParsed
}) => {
  if (!data?.identity) {
    return null
  }
  const getVesselPropertyParams = {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  }
  const vesselName = formatInfoField(
    getVesselProperty(data.identity, 'shipname', getVesselPropertyParams),
    'shipname'
  )

  const vesselFlag = getVesselProperty(data.identity, 'flag', getVesselPropertyParams)

  const vesselType = getVesselShipTypeLabel({
    shiptypes: getVesselProperty(data.identity, 'shiptypes', getVesselPropertyParams),
  })

  return (
    <span>{`${vesselName} ${vesselFlag ? `(${vesselFlag})` : ''} ${vesselType ? `- ${vesselType}` : ''}`}</span>
  )
}

export default VesselGroupReportVesselsIndividualTooltip
