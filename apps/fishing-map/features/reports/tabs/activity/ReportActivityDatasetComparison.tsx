import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import cx from 'classnames'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { DATASET_COMPARISON_SUFFIX, LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LAYERS_LIBRARY_ENVIRONMENT } from 'data/layer-library/layers-environment'
import { TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG } from 'data/workspaces'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'

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
  const { upsertDataviewInstance, removeDataviewInstance } = useDataviewInstancesConnect()

  const reportDataviews = useSelector(selectActiveReportDataviews)
  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)

  const environmentalLayerOptions = useMemo(() => {
    return LAYERS_LIBRARY_ENVIRONMENT.filter(
      (layer) => layer?.dataviewId === TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG
    ).map((layer) =>
      createDatasetOption(layer?.id || '', t(`layer-library:${layer.id}.name`), layer.config?.color)
    )
  }, [t])

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
    return environmentalLayerOptions.find((layer) => layer.id === selectedId)
  }, [environmentalLayerOptions, comparisonDatasets?.compare])

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
    const layerConfig = LAYERS_LIBRARY_ENVIRONMENT.find((layer) => layer.id === option.id)
    if (!layerConfig) return

    const dataviewID = `${option.id}${LAYER_LIBRARY_ID_SEPARATOR}${DATASET_COMPARISON_SUFFIX}`
    const { category, dataviewId, datasetsConfig, config } = layerConfig

    if (comparisonDatasets?.compare) {
      removeDataviewInstance(comparisonDatasets.compare)
    }

    upsertDataviewInstance({
      id: dataviewID,
      category,
      dataviewId,
      datasetsConfig,
      config: {
        ...config,
        visible: true,
      },
    })

    dispatchQueryParams({
      reportComparisonDataviewIds: {
        main: comparisonDatasets?.main || mainDatasetOptions[0]?.id,
        compare: dataviewID,
      },
    })
  }

  return (
    <div className={cx([styles.titleRow, styles.selectorsRow])}>
      <Select
        options={mainDatasetOptions}
        onSelect={onMainSelect}
        selectedOption={selectedMainDataset}
        disabled={mainDatasetOptions.length <= 1}
        className={styles.select}
      />
      <Select
        options={environmentalLayerOptions}
        selectedOption={selectedComparisonDataset}
        onSelect={onCompareSelect}
        className={styles.select}
        placeholder={t('translations:analysis.selectDatasetPlaceholder')}
      />
    </div>
  )
}

export default ReportActivityDatasetComparison
