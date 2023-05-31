import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { formatSliderNumber, TagList } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
  getSchemaFilterUnitInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectTimeRange } from 'features/app/app.selectors'
import { getTimeRangeDuration } from 'utils/dates'
import { VESSEL_GROUPS_DAYS_LIMIT } from 'data/config'
import { VALUE_TRANSFORMATIONS_BY_UNIT } from 'features/workspace/activity/ActivitySchemaFilter'

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
  const filterUnit = getSchemaFilterUnitInDataview(dataview, field)
  const schemaFieldSelected = getSchemaFieldsSelectedInDataview(
    dataview,
    field,
    vesselGroupsOptions
  )

  let valuesSelected = schemaFieldSelected.sort((a, b) => a.label - b.label)

  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 && valuesSelected.every((value) => !Number.isNaN(value[0].label))

  const valuesIsNumber = Number(valuesSelected[0]?.label)

  if (valuesAreRangeOfNumbers) {
    const range = `${formatSliderNumber(valuesSelected[0][0].label)} - ${formatSliderNumber(
      valuesSelected[valuesSelected.length - 1][0].label
    )}`
    valuesSelected = [
      {
        id: range,
        label: range,
      },
    ]
  } else if (valuesIsNumber) {
    valuesSelected = [
      {
        id: valuesSelected.id,
        label: filterUnit
          ? `${formatSliderNumber(
              VALUE_TRANSFORMATIONS_BY_UNIT[filterUnit].in(valuesSelected[0]?.label)
            )} ${VALUE_TRANSFORMATIONS_BY_UNIT[filterUnit].label}`
          : formatSliderNumber(valuesSelected[0]?.label),
      },
    ]
  }

  return (
    <Fragment>
      {valuesSelected.length > 0 && (
        <div className={styles.filter}>
          <label>
            {label}
            {filterOperation === EXCLUDE_FILTER_ID && ` (${t('common.excluded', 'Excluded')})`}
            {VESSEL_GROUPS_DAYS_LIMIT > 0 &&
              field === 'vessel-groups' &&
              duration!?.days > VESSEL_GROUPS_DAYS_LIMIT && (
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
