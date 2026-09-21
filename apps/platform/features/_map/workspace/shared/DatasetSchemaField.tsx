import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import { DatasetTypes, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { getDatasetConfiguration } from '@globalfishingwatch/datasets-client'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'

import {
  getFilterOperationInDataview,
  getFiltersInDataview,
  getFiltersSelectedInDataview,
  getFilterUnitInDataview,
} from 'features/_map/dataviews/dataviews.filters'
import { isHistogramDataviewSupported } from 'features/_map/workspace/shared/layer-properties.utils'
import {
  getFilterLabelById,
  getFilterValueById,
  getValueLabelByUnit,
} from 'features/_map/workspace/shared/LayerSchemaFilter.utils'
import { selectIsGuestUser } from 'features/_user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/_user/vessel-groups/vessel-groups.hooks'
import { usePorts } from 'utils/ports'

import { useDataviewInstancesConnect } from '../workspace.hook'

import styles from 'features/_map/workspace/shared/LayerPanel.module.css'

const ascending = (a: number, b: number) => a - b

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetFilter
  label: string
  className?: string
  onRemove?: (tag: TagItem) => void
}

function DatasetSchemaField({
  dataview,
  field,
  label,
  className = '',
  onRemove,
}: LayerPanelProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const vesselGroupsOptions = useVesselGroupsOptions()
  const isGuestUser = useSelector(selectIsGuestUser)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  usePorts(field === 'next_port_id' && !!dataview.config?.filters?.[field])

  const filterOperation = getFilterOperationInDataview(dataview, field)
  const filterUnit = getFilterUnitInDataview(dataview, field)
  const schemaFieldSelected = getFiltersSelectedInDataview(dataview, field, {
    vesselGroups: vesselGroupsOptions,
    isGuestUser,
  })
  const { filtersAllowed } = useMemo(() => getFiltersInDataview(dataview), [dataview])
  const filterConfig = filtersAllowed.find((filter) => filter.id === field)

  let valuesSelected = Array.isArray(schemaFieldSelected)
    ? schemaFieldSelected.sort((a, b) => a.label - b.label)
    : schemaFieldSelected

  const valuesAreRangeOfNumbers =
    (filterConfig?.type === 'range' || filterConfig?.type === 'number') &&
    valuesSelected.length > 1 &&
    valuesSelected.every((value: any) => {
      const label = Array.isArray(value) ? (value[0]?.label as string) : value.label
      return !isNaN(label) && !isNaN(parseFloat(label))
    })

  const valuesIsNumber = filterConfig?.type === 'number' && Number(valuesSelected[0]?.label)

  const toDisplay = (value: string | number) => getFilterValueById(value, { id: field })
  const toStored = (value: number) =>
    getFilterValueById(value, { id: field, transformDirection: 'out' })
  // Both bounds are always stored, so removing one tag needs the limits to put that side back
  let rangeBounds: { values: number[]; limits: number[] } | undefined

  if (valuesAreRangeOfNumbers) {
    const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)
    const { max, min } = getDatasetConfiguration(dataset)
    const unit = filterUnit || dataset?.unit
    const values = (valuesSelected as { label: string }[][])
      .flat()
      .map(({ label }) => toDisplay(label))
      .sort(ascending)
    const limits = (
      isHistogramDataviewSupported(dataview)
        ? [min, max]
        : [filterConfig.options[0].label, filterConfig.options[1].label]
    )
      .map(toDisplay)
      .sort(ascending)
    rangeBounds = { values: [values[0], values[values.length - 1]], limits }
    valuesSelected = rangeBounds.values.flatMap((value, bound) =>
      value === limits[bound]
        ? []
        : [
            {
              id: `${bound ? 'max' : 'min'}-${value}`,
              label: `${bound ? '≤' : '≥'} ${getValueLabelByUnit(value, { unit })}`,
            },
          ]
    )
  } else if (valuesIsNumber) {
    valuesSelected = [
      {
        id: valuesSelected.id,
        label: getValueLabelByUnit(valuesSelected[0]?.label, { unit: filterUnit }),
      },
    ]
  }

  const onRemoveFilterClick = (tag: TagItem, tags: TagItem[]) => {
    if (field === 'visibleValues') {
      const bound = tag.id.toString().startsWith('max-') ? 'maxVisibleValue' : 'minVisibleValue'
      upsertDataviewInstance({
        id: dataview.id,
        config: { [bound]: undefined },
      })
    } else if (rangeBounds) {
      const { values, limits } = rangeBounds
      const next = values.map((value, bound) =>
        tag.id.toString().startsWith(bound ? 'max' : 'min') ? limits[bound] : value
      )
      upsertDataviewInstance({
        id: dataview.id,
        config: {
          filters: {
            ...(dataview.config?.filters || {}),
            [field]: next.every((value, bound) => value === limits[bound])
              ? ''
              : next.map(toStored).sort(ascending).map(String),
          },
        },
      })
    } else {
      upsertDataviewInstance({
        id: dataview.id,
        config: {
          filters: {
            ...(dataview.config?.filters || {}),
            [field]: tags.length ? tags.map((t) => t.id) : '',
          },
        },
      })
    }
    if (onRemove) {
      onRemove({ id: field, label: tag.label })
    }
  }

  return (
    <Fragment>
      {valuesSelected.length > 0 && (
        <div className={cx(styles.filter, className)}>
          <label className={styles.tagListLabel}>
            {getFilterLabelById(field, label)}
            {filterOperation === EXCLUDE_FILTER_ID && ` (${t((t) => t.common.excluded)})`}
          </label>
          <TagList
            tags={valuesSelected}
            color={dataview.config?.color}
            className={styles.tagList}
            onRemove={onRemoveFilterClick}
          />
        </div>
      )}
    </Fragment>
  )
}

export default DatasetSchemaField
