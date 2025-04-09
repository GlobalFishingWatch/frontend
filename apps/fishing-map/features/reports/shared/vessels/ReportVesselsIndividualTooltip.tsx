import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import I18nNumber from 'features/i18n/i18nNumber'
import { selectReportCategory } from 'features/reports/reports.selectors'
import { ReportCategory } from 'features/reports/reports.types'

import type { ReportTableVessel } from './report-vessels.types'

import styles from './ReportVesselsIndividualTooltip.module.css'

const ReportVesselsIndividualTooltip = ({ data }: { data?: ReportTableVessel }) => {
  const { t } = useTranslation()
  const reportCategory = useSelector(selectReportCategory)
  if (!data) {
    return null
  }
  let unit = ''
  if (reportCategory === ReportCategory.Activity) {
    unit = t('common.hour', { count: data.value }).toLowerCase()
  } else if (reportCategory === ReportCategory.Detections) {
    unit = t('common.detection', { count: data.value }).toLowerCase()
  } else if (reportCategory === ReportCategory.Events) {
    unit = t('common.event', { count: data.value }).toLowerCase()
  }
  return (
    <div>
      <div className={styles.title}>
        <p className={styles.name}>{data.shipName}</p>
        {data.value && (
          <p className={styles.value}>
            <I18nNumber number={data.value} /> {unit}
          </p>
        )}
      </div>
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
