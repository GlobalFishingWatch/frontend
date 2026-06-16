import { useTranslation } from 'react-i18next'

import type { SupportedDatasetFilter } from '@globalfishingwatch/datasets-client'
import { type UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import type { DataviewFilterConfig } from 'features/dataviews/dataviews.filters'
import LayerSchemaFilter from 'features/workspace/shared/LayerSchemaFilter'
import { getActivityFilters, getActivitySources, getEventLabel } from 'utils/analytics'

import { type OnSelectFilterArgs, trackEventCb } from './LayerFilters.utils'

const MIN_GAP_HOURS = 0
const MAX_GAP_HOURS = 24
const GAP_FILTER_ID = 'maxGapHours' as SupportedDatasetFilter

type LayerFiltersGapProps = {
  dataview: UrlDataviewInstance
  onGapChange: (dataviewInstance: UrlDataviewInstance) => void
}

function LayerFiltersGap({ dataview, onGapChange }: LayerFiltersGapProps): React.ReactElement<any> {
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

  const onChange = (newMaxGapHours: number | undefined) => {
    onGapChange({
      id: dataview.id,
      config: { maxGapHours: newMaxGapHours },
    })
    const eventLabel = getEventLabel([
      'select',
      getActivitySources(dataview),
      ...getActivityFilters({ maxGapHours: newMaxGapHours }),
    ])
    trackEventCb(GAP_FILTER_ID, eventLabel)
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
