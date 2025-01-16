import { useTranslation } from 'react-i18next'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { VesselGroupVesselTableParsed } from 'features/reports/vessel-groups/vessels/vessel-group-report-vessels.selectors'
import { getVesselProperty } from 'features/vessel/vessel.utils'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselShipTypeLabel } from 'utils/info'

import styles from './VesselGroupReportVesselsIndividualTooltip.module.css'

const VesselGroupReportVesselsIndividualTooltip = ({
  data,
}: {
  data?: VesselGroupVesselTableParsed
}) => {
  const { t } = useTranslation()
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

  const mmsi = data.identity
    ? getVesselProperty(data.identity, 'ssvid', getVesselPropertyParams)
    : data.ssvid || data.mmsi

  const vesselFlag = data.identity
    ? getVesselProperty(data.identity, 'flag', getVesselPropertyParams)
    : data.flag

  const vesselType = data.identity
    ? getVesselShipTypeLabel({
        shiptypes: getVesselProperty(data.identity, 'shiptypes', getVesselPropertyParams),
      })
    : data.vesselType || data.geartype

  return (
    <div>
      <span className={styles.name}>{vesselName}</span>
      <div className={styles.properties}>
        <div className={styles.property}>
          <label>{t('vessel.mmsi', 'MMSI')}</label>
          <span>{mmsi || EMPTY_FIELD_PLACEHOLDER}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.flag', 'Flag')}</label>
          <span>{formatInfoField(vesselFlag, 'flag') || EMPTY_FIELD_PLACEHOLDER}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.type', 'Ship Type')}</label>
          <span>{formatInfoField(vesselType, 'shiptypes') || EMPTY_FIELD_PLACEHOLDER}</span>
        </div>
      </div>
      <div className={styles.cta}>
        {t('vessel.clickToSeeMore', 'Click to see more information')}
      </div>
    </div>
  )
}

export default VesselGroupReportVesselsIndividualTooltip
