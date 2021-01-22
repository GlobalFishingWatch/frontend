import React, { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import MultiSelect, {
  MultiSelectOnChange,
  MultiSelectOption,
} from '@globalfishingwatch/ui-components/dist/multi-select'
import { getFlags, getFlagsByIds } from 'utils/flags'
import { UrlDataviewInstance } from 'types'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getPlaceholderBySelections } from 'features/i18n/utils'
import styles from './HeatmapFilters.module.css'
import {
  getCommonSchemaFieldsInDataview,
  getNotSupportedSchemaFieldsDatasets,
  getSourcesOptionsInDataview,
  getSourcesSelectedInDataview,
  getSupportedSchemaFieldsDatasets,
} from './heatmaps.utils'

type FiltersProps = {
  dataview: UrlDataviewInstance
}

function Filters({ dataview }: FiltersProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const sourceOptions = getSourcesOptionsInDataview(dataview)
  const sourcesSelected = getSourcesSelectedInDataview(dataview)

  const gearTypeOptions = getCommonSchemaFieldsInDataview(dataview, 'geartype')
  const gearTypeSelected = gearTypeOptions?.filter((geartype) =>
    dataview.config?.filters?.geartype?.includes(geartype.id)
  )
  const fleetOptions = getCommonSchemaFieldsInDataview(dataview, 'fleet')
  const fleetSelected = fleetOptions?.filter((fleet) =>
    dataview.config?.filters?.fleet?.includes(fleet.id)
  )

  const flagOptions = getFlagsByIds(dataview.config?.filters?.flag || [])
  const flags = useMemo(getFlags, [])

  const datasetsWithoutGeartype = getNotSupportedSchemaFieldsDatasets(dataview, 'geartype')
  const datasetsWithoutFleet = getNotSupportedSchemaFieldsDatasets(dataview, 'fleet')

  const datasetsWithGeartype = getSupportedSchemaFieldsDatasets(dataview, 'geartype')
  const datasetsWithFleet = getSupportedSchemaFieldsDatasets(dataview, 'fleet')

  const supportsGearTypeSelection = datasetsWithGeartype && datasetsWithGeartype.length > 0
  const supportsFleetSelection = datasetsWithFleet && datasetsWithFleet.length > 0

  const onSelectSourceClick: MultiSelectOnChange = (source) => {
    const datasets = [...(dataview.config?.datasets || []), source.id]
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}

    const newDataview = { ...dataview, config: { ...dataview.config, datasets } }
    if (filters['geartype']) {
      const newGeartypeOptions = getCommonSchemaFieldsInDataview(newDataview, 'geartype')
      const newGeartypeSelection = newGeartypeOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newGeartypeOptions.length === 0) {
        delete filters['geartype']
        // or keep only the options that every dataset have in common
      } else if (!newGeartypeSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.geartype = newGeartypeSelection.map(({ id }) => id)
      }
    }

    if (filters['fleet']) {
      const newFleetOptions = getCommonSchemaFieldsInDataview(newDataview, 'fleet')
      const newFleetSelection = newFleetOptions?.filter((geartype) =>
        dataview.config?.filters?.geartype?.includes(geartype.id)
      )

      // We have to remove the geartype if it is not supported by the datasets selecion
      if (newFleetOptions.length === 0) {
        delete filters['fleet']
        // or keep only the options that every dataset have in common
      } else if (!newFleetSelection?.length !== dataview.config?.filters?.geartype?.length) {
        filters.fleet = newFleetSelection.map(({ id }) => id)
      }
    }
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        datasets,
        filters,
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

  const onSelectFilterClick = (filterKey: string, selection: MultiSelectOption) => {
    const filterValues = [...(dataview.config?.filters?.[filterKey] || []), selection.id]
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        filters: {
          ...(dataview.config?.filters || {}),
          [filterKey]: filterValues,
        },
      },
    })
  }

  const onRemoveFilterClick = (filterKey: string, selection: MultiSelectOption[]) => {
    const filterValue = selection?.length ? selection.map((f) => f.id) : null
    const filters = dataview.config?.filters || {}
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters: { ...filters, [filterKey]: filterValue } },
    })
  }

  const onCleanFilterClick = (filterKey: string) => {
    const filters = dataview.config?.filters ? { ...dataview.config.filters } : {}
    delete filters[filterKey]
    upsertDataviewInstance({
      id: dataview.id,
      config: { filters },
    })
  }

  const disabledGeartype = datasetsWithoutGeartype && datasetsWithoutGeartype.length > 0
  const disabledGeartypeTooltip = disabledGeartype
    ? t('errors.notSupportedBy', {
        list: datasetsWithoutGeartype?.map((d) => d.name).join(','),
        defaultValue: 'Not supported by {{list}}',
      })
    : ''
  const disabledFleet = datasetsWithoutFleet && datasetsWithoutFleet.length > 0
  const disabledFleetTooltip = disabledFleet
    ? t('errors.notSupportedBy', {
        list: datasetsWithoutFleet?.map((d) => d.name).join(','),
        defaultValue: 'Not supported by {{list}}',
      })
    : ''

  return (
    <Fragment>
      {sourceOptions && sourceOptions?.length > 1 && (
        <MultiSelect
          label={t('layer.source_plural', 'Sources')}
          placeholder={getPlaceholderBySelections(sourcesSelected)}
          options={sourceOptions}
          selectedOptions={sourcesSelected}
          onSelect={onSelectSourceClick}
          onRemove={sourcesSelected?.length > 1 ? onRemoveSourceClick : undefined}
        />
      )}
      <MultiSelect
        label={t('layer.flagState_plural', 'Flag States')}
        placeholder={getPlaceholderBySelections(flagOptions)}
        options={flags}
        selectedOptions={flagOptions}
        className={styles.multiSelect}
        onSelect={(selection) => onSelectFilterClick('flag', selection)}
        onRemove={(selection, rest) => onRemoveFilterClick('flag', rest)}
        onCleanClick={() => onCleanFilterClick('flag')}
      />
      {supportsGearTypeSelection && (
        <MultiSelect
          disabled={disabledGeartype}
          disabledMsg={disabledGeartypeTooltip}
          label={t('layer.gearType_plural', 'Gear types')}
          placeholder={getPlaceholderBySelections(gearTypeSelected)}
          options={gearTypeOptions}
          selectedOptions={gearTypeSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('geartype', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('geartype', rest)}
          onCleanClick={() => onCleanFilterClick('geartype')}
        />
      )}
      {supportsFleetSelection && (
        <MultiSelect
          disabled={disabledFleet}
          disabledMsg={disabledFleetTooltip}
          label={t('vessels.fleet', 'Fleet')}
          placeholder={getPlaceholderBySelections(fleetSelected)}
          options={fleetOptions}
          selectedOptions={fleetSelected}
          className={styles.multiSelect}
          onSelect={(selection) => onSelectFilterClick('fleet', selection)}
          onRemove={(selection, rest) => onRemoveFilterClick('fleet', rest)}
          onCleanClick={() => onCleanFilterClick('fleet')}
        />
      )}
    </Fragment>
  )
}

export default Filters
