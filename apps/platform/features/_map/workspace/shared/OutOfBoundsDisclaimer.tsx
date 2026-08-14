import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import cx from 'classnames'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import { getDatasetsExtent } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import { LAST_DATA_UPDATE } from 'data/map/config'
import {
  SAR_DATAVIEW_INSTANCE_ID,
  VIIRS_DATAVIEW_INSTANCE_ID,
  VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
} from 'data/map/dataviews'
import {
  getActiveDatasetsInActivityDataviews,
  getDatasetsInDataviews,
} from 'features/_map/datasets/datasets.utils'
import { useTimerangeConnect } from 'features/_map/timebar/timebar.hooks'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'

import styles from 'features/_map/workspace/shared/LayerPanel.module.css'

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

  const isVIIRSLayer =
    dataview.id.includes(VIIRS_DATAVIEW_INSTANCE_ID) &&
    !dataview.id.includes(VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID)
  const isSARLayer = dataview.id.includes(SAR_DATAVIEW_INSTANCE_ID)

  if (isVIIRSLayer) {
    return (
      <span className={cx(styles.dataWarning, styles.error, className)}>
        <span className={cx(styles.dataWarning, styles.error, className)}>
          {t((t) => t.dataset.VIIRSDelayDisclaimer)}
        </span>
      </span>
    )
  }

  if (isSARLayer) {
    return (
      <span className={cx(styles.dataWarning, styles.error, className)}>
        <span className={cx(styles.dataWarning, styles.error, className)}>
          <Trans i18nKey={(t) => t.dataset.SARDelayDisclaimer}>
            Paused while we move from Sentinel-1A to Sentinel-1C and 1D.{' '}
            <a
              className={styles.link}
              href="https://globalfishingwatch.org/platform-update/sar-vessel-detection-and-fixed-infrastructure-datasets-issue"
              target="_blank"
              rel="noreferrer"
            >
              Learn more.
            </a>
          </Trans>
        </span>
      </span>
    )
  }

  if (validate === 'start') {
    if (!extentStart) {
      return null
    }
    const datasetInTimerange = end >= extentStart
    return datasetInTimerange ? null : (
      <span className={cx(styles.dataWarning, styles.error, className)}>
        {t((t) => t.dataset.noDataForTimerange)}.
        <br />
        {t((t) => t.dataset.extentStart, {
          start: formatI18nDate(extentStart),
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
        {t((t) => t.dataset.noDataForTimerange)}.
        <br />
        {t((t) => t.dataset.extentEnd, {
          end: formatI18nDate(extentEnd),
        })}
      </span>
    )
  }

  if (!extentStart || !extentEnd) {
    return null
  }

  const datasetInTimerange = start < extentEnd && end > extentStart

  return datasetInTimerange ? null : (
    <span className={cx(styles.dataWarning, styles.error, className)}>
      {t((t) => t.dataset.noDataForTimerange)}.
      <br />
      {t((t) => t.dataset.extent, {
        extent: [formatI18nDate(extentStart), formatI18nDate(extentEnd)].join(' - '),
      })}
    </span>
  )
}

export default OutOfTimerangeDisclaimer
