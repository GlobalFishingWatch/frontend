import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import I18nNumber from 'features/i18n/i18nNumber'
import { selectReportUnit } from 'features/reports/reports.selectors'

import type { ReportTableVessel } from './report-vessels.types'

import styles from './ReportVesselsIndividualTooltip.module.css'

const ReportVesselsIndividualTooltip = ({ data }: { data?: ReportTableVessel }) => {
  const { t } = useTranslation()
  const reportUnit = useSelector(selectReportUnit)
  if (!data) {
    return null
  }
  return (
    <div>
      <div className={styles.title}>
        <p className={styles.name}>{data.shipName}</p>
        {data.value && data.value !== -1 && (
          <p className={styles.value}>
            <I18nNumber number={data.value} />{' '}
            {reportUnit &&
              t(`common.${reportUnit}`, {
                count: data.value,
                defaultValue: reportUnit,
              }).toLowerCase()}
          </p>
        )}
      </div>
      <div className={styles.properties}>
        <div className={styles.property}>
          <label>{t('vessel.mmsi')}</label>
          <span>{data.ssvid}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.flag')}</label>
          <span>{data.flagTranslated}</span>
        </div>
        <div className={styles.property}>
          <label>{t('vessel.type')}</label>
          <span>{data.vesselType}</span>
        </div>
      </div>
      <div className={styles.cta}>{t('vessel.clickToSeeMore')}</div>
    </div>
  )
}

export default ReportVesselsIndividualTooltip
