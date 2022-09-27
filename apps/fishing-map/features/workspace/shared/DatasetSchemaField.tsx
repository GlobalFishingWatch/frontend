import { Fragment } from 'react'
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

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
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
