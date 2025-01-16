import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import type { TagItem } from '@globalfishingwatch/ui-components'
import { TagList } from '@globalfishingwatch/ui-components'

import type { SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import {
  getSchemaFieldsSelectedInDataview,
  getSchemaFilterOperationInDataview,
  getSchemaFilterUnitInDataview,
} from 'features/datasets/datasets.utils'
import { selectIsGuestUser } from 'features/user/selectors/user.selectors'
import { useVesselGroupsOptions } from 'features/vessel-groups/vessel-groups.hooks'
import { getValueLabelByUnit } from 'features/workspace/common/LayerSchemaFilter'
import styles from 'features/workspace/shared/LayerPanel.module.css'

import { useDataviewInstancesConnect } from '../workspace.hook'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
  field: SupportedDatasetSchema
  label: string
}

function DatasetSchemaField({ dataview, field, label }: LayerPanelProps): React.ReactElement<any> {
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

  let valuesSelected = Array.isArray(schemaFieldSelected)
    ? schemaFieldSelected.sort((a, b) => a.label - b.label)
    : schemaFieldSelected

  const valuesAreRangeOfNumbers =
    valuesSelected.length > 1 &&
    valuesSelected.every((value: any) => {
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
    const range = `${getValueLabelByUnit(label, {
      unit: filterUnit,
      unitLabel: false,
    })} - ${getValueLabelByUnit(label2, { unit: filterUnit })}`
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
        label: getValueLabelByUnit(valuesSelected[0]?.label, { unit: filterUnit }),
      },
    ]
  }

  const onRemoveClick = (tag: TagItem, tags: TagItem[]) => {
    console.log(tags)
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
        <div className={styles.filter}>
          <label>
            {label}
            {filterOperation === EXCLUDE_FILTER_ID && ` (${t('common.excluded', 'Excluded')})`}
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
