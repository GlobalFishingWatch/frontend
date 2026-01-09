import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { DataviewCategory } from '@globalfishingwatch/api-types'
import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { DATASET_COMPARISON_SUFFIX, LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { useAppDispatch } from 'features/app/app.hooks'
import { selectAllDatasets } from 'features/datasets/datasets.slice'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectAllDataviews } from 'features/dataviews/dataviews.slice'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { resolveLibraryLayers } from 'features/layer-library/LayerLibrary'
import { isSupportedComparisonDataview } from 'features/reports/report-area/area-reports.utils'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import { selectReportSubCategory } from 'features/reports/reports.selectors'
import { updateLocation } from 'routes/routes.actions'
import { useLocationConnect } from 'routes/routes.hook'
import {
  selectLocationPayload,
  selectLocationQuery,
  selectLocationType,
  selectUrlDataviewInstances,
} from 'routes/routes.selectors'

import styles from './ReportActivityDatasetComparison.module.css'

const createDatasetOption = (id: string, label: string, color?: string): SelectOption => ({
  id,
  label: (
    <div className={styles.datasetOption}>
      <span className={styles.dot} style={{ color }} />
      {label}
    </div>
  ),
})

const ReportActivityDatasetComparison = () => {
  const { t } = useTranslation(['layer-library', 'translations'])
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()

  const reportDataviews = useSelector(selectActiveReportDataviews)
  const reportSubcategory = useSelector(selectReportSubCategory)
  const urlDataviewInstances = useSelector(selectUrlDataviewInstances)
  const locationPayload = useSelector(selectLocationPayload)
  const locationQuery = useSelector(selectLocationQuery)
  const locationType = useSelector(selectLocationType)

  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)
  const allDataviews = useSelector(selectAllDataviews)
  const allDatasets = useSelector(selectAllDatasets)

  const allLayersResolved = useMemo(() => {
    return resolveLibraryLayers(allDataviews, false, t)
  }, [allDataviews, t])

  const layersResolved = useMemo(() => {
    const reportCategory = reportDataviews[0]?.category
    return allLayersResolved?.filter((layer) => {
      const datasetId = layer.dataview.datasetsConfig?.[0]?.datasetId
      const dataset = allDatasets.find((dataset) => dataset.id === datasetId)
      const isActivitySameCategory =
        layer.dataview.category === reportCategory && reportCategory === DataviewCategory.Activity
      if (!dataset || dataset?.subcategory === reportSubcategory || isActivitySameCategory) {
        return false
      }
      if (comparisonDatasets?.main?.split(LAYER_LIBRARY_ID_SEPARATOR)[0] === layer.id) {
        return false
      }
      return isSupportedComparisonDataview(layer.dataview)
    })
  }, [reportDataviews, allLayersResolved, allDatasets, reportSubcategory, comparisonDatasets?.main])

  const layerOptions = useMemo(() => {
    return layersResolved.map((layer) =>
      createDatasetOption(layer?.id, layer?.name || '', layer.config?.color)
    )
  }, [layersResolved])

  const mainDatasetOptions = useMemo(
    () =>
      reportDataviews.map((dataview) =>
        createDatasetOption(
          dataview.id,
          getDatasetTitleByDataview(dataview, { showPrivateIcon: false }),
          dataview.config?.color
        )
      ),
    [reportDataviews]
  )

  const selectedMainDataset = useMemo(
    () =>
      mainDatasetOptions.find((opt) => opt.id === comparisonDatasets?.main) ||
      mainDatasetOptions[0],
    [mainDatasetOptions, comparisonDatasets?.main]
  )

  const selectedComparisonDataset = useMemo(() => {
    const selectedId = comparisonDatasets?.compare?.split(LAYER_LIBRARY_ID_SEPARATOR)[0]
    return selectedId ? layerOptions.find((layer) => layer.id === selectedId) : undefined
  }, [comparisonDatasets?.compare, layerOptions])

  useEffect(() => {
    if (selectedMainDataset?.id && selectedMainDataset.id !== comparisonDatasets?.main) {
      dispatchQueryParams({
        reportComparisonDataviewIds: {
          main: selectedMainDataset.id,
          compare: comparisonDatasets?.compare,
        },
      })
    }
  }, [
    selectedMainDataset?.id,
    comparisonDatasets?.main,
    comparisonDatasets?.compare,
    dispatchQueryParams,
  ])

  const onMainSelect = (option: SelectOption) => {
    dispatchQueryParams({
      reportComparisonDataviewIds: {
        main: option.id,
        compare: comparisonDatasets?.compare,
      },
    })
  }

  const onCompareSelect = (option: SelectOption) => {
    const layerConfig = layersResolved.find((layer) => layer.id === option.id)
    if (!layerConfig) return

    const dataviewID = `${option.id}${LAYER_LIBRARY_ID_SEPARATOR}${DATASET_COMPARISON_SUFFIX}`
    const { category, dataviewId, datasetsConfig, config } = layerConfig

    const newDataviewInstances = (urlDataviewInstances || []).filter(
      (dv) => dv.id !== comparisonDatasets?.compare
    )

    newDataviewInstances.push({
      id: dataviewID,
      origin: 'comparison',
      category,
      dataviewId,
      datasetsConfig,
      config: {
        ...config,
        visible: true,
      },
    })
    dispatch(
      updateLocation(locationType, {
        payload: locationPayload,
        query: {
          ...locationQuery,
          reportComparisonDataviewIds: {
            main: comparisonDatasets?.main || mainDatasetOptions[0]?.id,
            compare: dataviewID,
          },
          dataviewInstances: newDataviewInstances,
        },
      })
    )
  }

  return (
    <div className={styles.selectorsRow}>
      <Select
        options={mainDatasetOptions}
        onSelect={onMainSelect}
        selectedOption={selectedMainDataset}
        disabled={mainDatasetOptions.length <= 1}
        containerClassName={styles.select}
      />
      <Select
        options={layerOptions}
        selectedOption={selectedComparisonDataset}
        onSelect={onCompareSelect}
        containerClassName={styles.select}
        placeholder={t('translations:analysis.selectDatasetPlaceholder')}
      />
    </div>
  )
}

export default ReportActivityDatasetComparison
