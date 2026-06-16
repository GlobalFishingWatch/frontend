import { useTranslation } from 'react-i18next'

import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { DataviewFilterConfig } from 'features/dataviews/dataviews.filters'
import type { OnSelectFilterArgs } from 'features/workspace/shared/LayerFilters'
import LayerSchemaFilter from 'features/workspace/shared/LayerSchemaFilter'

const MIN_GAP_HOURS = 0
const MAX_GAP_HOURS = 24
const GAP_FILTER_ID = 'maxGapHours' as SupportedDatasetFilter

type LayerFiltersGapProps = {
  dataview: UrlDataviewInstance
  onChange: (maxGapHours: number | undefined) => void
}

function LayerFiltersGap({ dataview, onChange }: LayerFiltersGapProps): React.ReactElement<any> {
  const { t } = useTranslation()
  const maxGapHours = dataview.config?.maxGapHours ?? MAX_GAP_HOURS

  const schemaFilter: DataviewFilterConfig = {
    id: GAP_FILTER_ID,
    type: 'number',
    label: t((t) => t.layer.maxGapHours),
    disabled: false,
    options: [
      { id: String(MIN_GAP_HOURS), label: String(MIN_GAP_HOURS) },
      { id: String(MAX_GAP_HOURS), label: String(MAX_GAP_HOURS) },
    ],
    optionsSelected: [{ id: String(maxGapHours), label: String(maxGapHours) }],
    unit: 'hours',
    operation: 'gte',
    filterOperator: 'include',
    singleSelection: false,
  }

  const onSelect = ({ selection }: OnSelectFilterArgs) => {
    if (typeof selection === 'number') {
      onChange(selection)
    }
  }

  return (
    <LayerSchemaFilter
      schemaFilter={schemaFilter}
      onSelect={onSelect}
      onSelectOperation={() => {}}
      onRemove={() => {}}
      onClean={() => onChange(undefined)}
    />
  )
}

export default LayerFiltersGap
