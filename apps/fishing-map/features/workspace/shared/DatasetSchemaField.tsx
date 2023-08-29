import { Fragment } from 'react'
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
import { VALUE_TRANSFORMATIONS_BY_UNIT } from 'features/workspace/activity/ActivitySchemaFilter'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const filterOperation = getSchemaFilterOperationInDataview(dataview, field)
  const filterUnit = getSchemaFilterUnitInDataview(dataview, field)
  const schemaFieldSelected = getSchemaFieldsSelectedInDataview(
    dataview,
    field,
    vesselGroupsOptions
  )

  let valuesSelected = Array.isArray(schemaFieldSelected)
    ? schemaFieldSelected.sort((a, b) => a.label - b.label)
    : schemaFieldSelected

  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 &&
    valuesSelected.every((value) => {
      const label = Array.isArray(value) ? value[0]?.label : value.label
      return !isNaN(label) && !isNaN(parseFloat(label))
    })

  const valuesIsNumber = Number(valuesSelected[0]?.label)

  if (valuesAreRangeOfNumbers) {
    const label = Array.isArray(valuesSelected[0])
      ? valuesSelected[0][0]?.label
      : valuesSelected[0]?.label
    const label2 = Array.isArray(valuesSelected[valuesSelected.length - 1])
      ? valuesSelected[valuesSelected.length - 1][0]?.label
      : valuesSelected[valuesSelected.length - 1]?.label
    const range = `${formatSliderNumber(label)} - ${formatSliderNumber(label2)}`
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
