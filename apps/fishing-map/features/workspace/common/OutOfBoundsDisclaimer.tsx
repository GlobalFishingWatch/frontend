import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { DataviewCategory } from '@globalfishingwatch/api-types'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { formatI18nDate } from 'features/i18n/i18nDate'
import {
  getActiveDatasetsInActivityDataviews,
  getDatasetsInDataviews,
} from 'features/datasets/datasets.utils'

type OutOfTimerangeDisclaimerProps = {
  dataview: UrlDataviewInstance
}

const OutOfTimerangeDisclaimer = ({ dataview }: OutOfTimerangeDisclaimerProps) => {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const activeDatasetIds =
    dataview.category === DataviewCategory.Environment
      ? getDatasetsInDataviews([dataview])
      : getActiveDatasetsInActivityDataviews([dataview])

  const dataviewDatasets = dataview.datasets.filter((d) => activeDatasetIds.includes(d.id))

  if (dataviewDatasets.length !== 1) {
    return null
  }

  const { startDate, endDate } = dataviewDatasets[0]
  const datasetInTimerange =
    (start >= startDate && start <= endDate) || (end >= startDate && end <= endDate)

  return datasetInTimerange ? null : (
    <span className={cx(styles.dataWarning, styles.error)}>
      {t('dataset.outOfTimerange', {
        bounds: [formatI18nDate(startDate), formatI18nDate(endDate)].join(' - '),
        defaultValue: 'Dataset bounds ({{bounds}}) are out of current timerange selection',
      })}
    </span>
  )
}

export default OutOfTimerangeDisclaimer
