import { useTranslation } from 'react-i18next'

import type { ReportTableVessel } from './report-vessels.types'

import styles from './ReportVesselsIndividualTooltip.module.css'

const ReportVesselsIndividualTooltip = ({ data }: { data?: ReportTableVessel }) => {
  const { t } = useTranslation()
  if (!data) {
    return null
  }

  return (
    <div>
      <span className={styles.name}>{data.shipName}</span>
      <div className={styles.properties}>
        <div className={styles.property}>
          <label>{t('vessel.mmsi', 'MMSI')}</label>
          <span>{data.ssvid}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.flag', 'Flag')}</label>
          <span>{data.flagTranslated}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.type', 'Ship Type')}</label>
          <span>{data.vesselType}</span>
        </div>
      </div>
      <div className={styles.cta}>
        {t('vessel.clickToSeeMore', 'Click to see more information')}
      </div>
    </div>
  )
}

export default ReportVesselsIndividualTooltip
