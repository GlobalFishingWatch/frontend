import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAST_DATA_UPDATE } from 'data/config'
import {
  getActiveDatasetsInActivityDataviews,
  getDatasetsInDataviews,
} from 'features/datasets/datasets.utils'
import { formatI18nDate } from 'features/i18n/i18nDate'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type OutOfTimerangeDisclaimerValidate = 'start' | 'end' | 'both'
type OutOfTimerangeDisclaimerProps = {
  validate?: OutOfTimerangeDisclaimerValidate
  dataview: UrlDataviewInstance
  className?: string
}

const OutOfTimerangeDisclaimer = ({
  dataview,
  className,
  validate = 'both',
}: OutOfTimerangeDisclaimerProps) => {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()

  const { extentStart, extentEnd = LAST_DATA_UPDATE } = useMemo(() => {
    const activeDatasetIds =
      dataview.category === DataviewCategory.Environment ||
      dataview.category === DataviewCategory.Context
        ? getDatasetsInDataviews([dataview])
        : getActiveDatasetsInActivityDataviews([dataview])

    const activeDatasets = dataview.datasets?.filter((d) => activeDatasetIds.includes(d.id))
    return getDatasetsExtent<string>(activeDatasets, {
      format: 'isoString',
    })
  }, [dataview])

  if (validate === 'start') {
    if (!extentStart) {
      return null
    }
    const datasetInTimerange = end >= extentStart
    return datasetInTimerange ? null : (
      <span className={cx(styles.dataWarning, styles.error, className)}>
        {t('dataset.noDataForTimerange', 'No data for current timerange')}.
        <br />
        {t('dataset.extentStart', {
          start: formatI18nDate(extentStart),
          defaultValue: 'Dataset start date: {{start}}',
        })}
      </span>
    )
  } else if (validate === 'end') {
    if (!extentEnd) {
      return null
    }
    const datasetInTimerange = start <= extentEnd
    return datasetInTimerange ? null : (
      <span className={cx(styles.dataWarning, styles.error, className)}>
        {t('dataset.noDataForTimerange', 'No data for current timerange')}.
        <br />
        {t('dataset.extentEnd', {
          end: formatI18nDate(extentEnd),
          defaultValue: 'Dataset end date: {{end}}',
        })}
      </span>
    )
  }

  if (!extentStart || !extentEnd) {
    return null
  }

  const datasetInTimerange =
    (start >= extentStart && start <= extentEnd) ||
    (end >= extentStart && end <= extentEnd) ||
    (start <= extentStart && end >= extentEnd)

  return datasetInTimerange ? null : (
    <span className={cx(styles.dataWarning, styles.error, className)}>
      {t('dataset.noDataForTimerange', 'No data for current timerange')}.
      <br />
      {t('dataset.extent', {
        extent: [formatI18nDate(extentStart), formatI18nDate(extentEnd)].join(' - '),
        defaultValue: 'Dataset extent: {{ extent }}',
      })}
    </span>
  )
}

export default OutOfTimerangeDisclaimer
