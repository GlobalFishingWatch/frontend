import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { MultiSelect, MultiSelectOnChange } from '@globalfishingwatch/ui-components'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import styles from './HeatmapFilters.module.css'
import { getSourcesOptionsInDataview, getSourcesSelectedInDataview } from './heatmaps.utils'

type FiltersProps = {
  dataview: UrlDataviewInstance
}

function Filters({ dataview }: FiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  const sourcesSelected = getSourcesSelectedInDataview(dataview)

  const fishingFiltersOptions = getFlagsByIds(dataview.config?.filters || [])
  const flags = useMemo(getFlags, [])

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        datasets: [...(dataview.config?.datasets || []), source.id],
      },
    })
  }

  const onRemoveSourceClick: MultiSelectOnChange = (source) => {
    const datasets =
      dataview.config?.datasets?.filter((datasetId: string) => datasetId !== source.id) || null
    upsertDataviewInstance({
      id: dataview.id,
      config: { datasets },
    })
  }

  const onSelectFilterClick: MultiSelectOnChange = (filter) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: [...(dataview.config?.filters || []), filter.id] },
    })
  }

  const onRemoveFilterClick: MultiSelectOnChange = (filter, rest) => {
    const filters = rest?.length ? rest.map((f) => f.id) : null
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
    })
  }

  return (
    <Fragment>
      <MultiSelect
        label={t('layer.source_plural', 'Sources')}
        options={sourceOptions}
        selectedOptions={sourcesSelected}
        onSelect={onSelectSourceClick}
        onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
      />
      <MultiSelect
        label={t('layer.flag_state_plural', 'Flag States')}
        options={flags}
        selectedOptions={fishingFiltersOptions}
        className={styles.multiSelect}
        onSelect={onSelectFilterClick}
        onRemove={onRemoveFilterClick}
      />
    </Fragment>
  )
}

export default Filters
