import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatNumber, TagList } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectTimeRange } from 'features/app/app.selectors'
import { getTimeRangeDuration } from 'utils/dates'
import { VESSEL_GROUPS_DAYS_LIMIT } from 'data/config'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const timeRange = useSelector(selectTimeRange)
  const duration = getTimeRangeDuration(timeRange, 'days')
  const vesselGroupsOptions = useVesselGroupsOptions()
  const filterOperation = getSchemaFilterOperationInDataview(dataview, field)
  let valuesSelected = getSchemaFieldsSelectedInDataview(dataview, field, vesselGroupsOptions).sort(
    (a, b) => a.label - b.label
  )
  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 && valuesSelected.every((value) => Number(value.label))

  if (valuesAreRangeOfNumbers) {
    const range = `${formatNumber(valuesSelected[0].label)} - ${formatNumber(
      valuesSelected[valuesSelected.length - 1].label
    )}`
    valuesSelected = [
      {
        id: range,
        label: range,
      },
    ]
  }

  return (
    <Fragment>
      {valuesSelected.length > 0 && (
        <div className={styles.filter}>
          <label>
            {label}
            {filterOperation === EXCLUDE_FILTER_ID && (
              <span> ({t('common.excluded', 'Excluded')})</span>
            )}
            {VESSEL_GROUPS_DAYS_LIMIT > 0 &&
              field === 'vessel-groups' &&
              duration?.days > VESSEL_GROUPS_DAYS_LIMIT && (
                <span className={cx(styles.dataWarning, styles.error)}>
                  {' '}
                  {t(
                    'vesselGroup.timeRangeLimit',
                    'Supported only for time ranges shorter than 3 months'
                  )}
                </span>
              )}
          </label>
          <TagList
            tags={valuesSelected}
            color={dataview.config?.color}
            className={styles.tagList}
          />
        </div>
      )}
    </Fragment>
  )
}

export default DatasetSchemaField
