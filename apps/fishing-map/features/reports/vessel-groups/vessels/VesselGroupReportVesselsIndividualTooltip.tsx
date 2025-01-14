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
  if (!data) {
    return null
  }

  const getVesselPropertyParams = {
    identitySource: VesselIdentitySourceEnum.SelfReported,
  }

  const vesselName = formatInfoField(
    data.identity
      ? getVesselProperty(data.identity, 'shipname', getVesselPropertyParams)
      : data.shipName,
    'shipname'
  )

  const vesselFlag = data.identity
    ? getVesselProperty(data.identity, 'flag', getVesselPropertyParams)
    : data.flag

  const vesselType = data.identity
    ? getVesselShipTypeLabel({
        shiptypes: getVesselProperty(data.identity, 'shiptypes', getVesselPropertyParams),
      })
    : data.vesselType

  return (
    <span>{`${vesselName} ${vesselFlag ? `(${vesselFlag})` : ''} ${vesselType ? `- ${vesselType}` : ''}`}</span>
  )
}

export default VesselGroupReportVesselsIndividualTooltip
