import { Fragment } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { formatNumber, TagList } from '@globalfishingwatch/ui-components'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import {
  getSchemaFieldsSelectedInDataview,
  SupportedDatasetSchema,
} from 'features/datasets/datasets.utils'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { selectTimeRange } from 'features/app/app.selectors'
import { getTimeRangeDuration } from 'utils/dates'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement {
  const vesselGroupsOptions = useVesselGroupsOptions()
  const timeRange = useSelector(selectTimeRange)
  const duration = getTimeRangeDuration(timeRange, 'days')
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
            {field === 'vessel-groups' && duration?.days >= 90 && (
              <span className={cx(styles.dataWarning, styles.error)}>
                {' '}
                (Supported only by timeranges shorter than 90 days)
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
