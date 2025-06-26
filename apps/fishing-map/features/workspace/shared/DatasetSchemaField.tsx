import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'

import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
  getSchemaFiltersInDataview,
  getSchemaFilterUnitInDataview,
} from 'features/datasets/datasets.utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { isHistogramDataviewSupported } from 'features/workspace/shared/LayerFilters'
import { getValueLabelByUnit } from 'features/workspace/shared/LayerSchemaFilter'

import { useDataviewInstancesConnect } from '../workspace.hook'

import styles from 'features/workspace/shared/LayerPanel.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
  className?: string
}

function DatasetSchemaField({
  dataview,
  field,
  label,
  className = '',
}: LayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const isGuestUser = useSelector(selectIsGuestUser)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const filterOperation = getSchemaFilterOperationInDataview(dataview, field)
  const filterUnit = getSchemaFilterUnitInDataview(dataview, field)
  const schemaFieldSelected = getSchemaFieldsSelectedInDataview(dataview, field, {
    vesselGroups: vesselGroupsOptions,
    isGuestUser,
  })
  const { filtersAllowed } = useMemo(() => getSchemaFiltersInDataview(dataview), [dataview])

  let valuesSelected = Array.isArray(schemaFieldSelected)
    ? schemaFieldSelected.sort((a, b) => a.label - b.label)
    : schemaFieldSelected

  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 &&
    valuesSelected.every((value: any) => {
      const label = Array.isArray(value) ? (value[0]?.label as string) : value.label
      return !isNaN(label) && !isNaN(parseFloat(label))
    })

  const valuesIsNumber = Number(valuesSelected[0]?.label)

  if (valuesAreRangeOfNumbers) {
    const filterConfig = filtersAllowed.find((filter) => filter.id === field)
    const dataviewWithHistogramFilter = isHistogramDataviewSupported(dataview)
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
    const { max, min } = dataset?.configuration || {}
    const unit = filterUnit || dataset?.unit
    const minLabel = Array.isArray(valuesSelected[0])
      ? valuesSelected[0][0]?.label
      : valuesSelected[0]?.label
    const maxLabel = Array.isArray(valuesSelected[valuesSelected.length - 1])
      ? valuesSelected[valuesSelected.length - 1][0]?.label
      : valuesSelected[valuesSelected.length - 1]?.label
    let range = ''
    const minToCompare = dataviewWithHistogramFilter ? min : filterConfig?.options[0].label
    const maxToCompare = dataviewWithHistogramFilter ? max : filterConfig?.options[1].label
    if (minLabel.toString() === minToCompare?.toString()) {
      const maxValueLabel = getValueLabelByUnit(maxLabel, { unit })
      range = `< ${maxValueLabel}`
    } else if (maxLabel.toString() === maxToCompare?.toString()) {
      const minValueLabel = getValueLabelByUnit(minLabel, { unit })
      range = `> ${minValueLabel}`
    } else {
      const minValueLabel = getValueLabelByUnit(minLabel, { unit, unitLabel: false })
      const maxValueLabel = getValueLabelByUnit(maxLabel, { unit })
      range = `${minValueLabel} - ${maxValueLabel}`
    }
    valuesSelected = [{ id: range, label: range }]
  } else if (valuesIsNumber) {
    valuesSelected = [
      {
        id: valuesSelected.id,
        label: getValueLabelByUnit(valuesSelected[0]?.label, { unit: filterUnit }),
      },
    ]
  }

  const onRemoveClick = (tag: TagItem, tags: TagItem[]) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          [field]: tags.length ? tags.map((t) => t.id) : undefined,
        },
      },
    })
  }

  return (
    <Fragment>
      {valuesSelected.length > 0 && (
        <div className={cx(styles.filter, className)}>
          <label>
            {label}
            {filterOperation === EXCLUDE_FILTER_ID && ` (${t('common.excluded')})`}
          </label>
          <TagList
            tags={valuesSelected}
            color={dataview.config?.color}
            className={styles.tagList}
            onRemove={onRemoveClick}
          />
        </div>
      )}
    </Fragment>
  )
}

export default DatasetSchemaField
