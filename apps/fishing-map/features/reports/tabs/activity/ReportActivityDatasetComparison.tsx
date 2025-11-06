import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { SelectOption } from '@globalfishingwatch/ui-components'
import { Select } from '@globalfishingwatch/ui-components'

import { DATASET_COMPARISON_SUFFIX, LAYER_LIBRARY_ID_SEPARATOR } from 'data/config'
import { LAYERS_LIBRARY_ENVIRONMENT } from 'data/layer-library/layers-environment'
import { TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG } from 'data/workspaces'
import { useAppDispatch } from 'features/app/app.hooks'
import { getDatasetTitleByDataview } from 'features/datasets/datasets.utils'
import { selectActiveReportDataviews } from 'features/dataviews/selectors/dataviews.selectors'
import { selectReportComparisonDataviewIds } from 'features/reports/reports.config.selectors'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { useLocationConnect } from 'routes/routes.hook'

import { resetReportData } from './reports-activity.slice'

import activityStyles from './ReportActivity.module.css'

const ReportActivityDatasetComparison = () => {
  const { t } = useTranslation('layer-library')
  const { dispatchQueryParams } = useLocationConnect()
  const dispatch = useAppDispatch()

  const reportDataviews = useSelector(selectActiveReportDataviews)
  const comparisonDatasets = useSelector(selectReportComparisonDataviewIds)
  const { upsertDataviewInstance, removeDataviewInstance } = useDataviewInstancesConnect()

  const environmentalLayerOptions = useMemo(() => {
    return LAYERS_LIBRARY_ENVIRONMENT.filter(
      (layer) => layer?.dataviewId === TEMPLATE_HEATMAP_ENVIRONMENT_DATAVIEW_SLUG
    ).flatMap((layer) => {
      return {
        id: layer?.id || '',
        label: t(`${layer.id}.name`),
      }
    })
  }, [t])

  const mainDatasetOptions = reportDataviews.map((dataview) => ({
    id: dataview.id,
    label: (
      <div className={styles.datasetOption}>
        <circle className={styles.dot} style={{ color: dataview.config?.color }} />
        {getDatasetTitleByDataview(dataview, { showPrivateIcon: false })}
      </div>
    ),
  }))
  const selectedMainDataset =
    mainDatasetOptions.find((opt) => opt.id === comparisonDatasets?.main) || mainDatasetOptions[0]
  const selectedComparedDataviewId = comparisonDatasets?.compare?.split(
    LAYER_LIBRARY_ID_SEPARATOR
  )[0]
  const selectedComparisonDatasets = environmentalLayerOptions.find(
    (layer) => layer.id === selectedComparedDataviewId
  )

  useEffect(() => {
    if (selectedMainDataset.id && selectedMainDataset.id !== comparisonDatasets?.main) {
      dispatchQueryParams({
        reportComparisonDataviewIds: {
          main: selectedMainDataset.id,
          compare: comparisonDatasets?.compare,
        },
      })
    }
  }, [selectedMainDataset.id])

  const onMainSelect = (option: SelectOption) => {
    dispatchQueryParams({
      reportComparisonDataviewIds: {
        main: option.id,
        compare: comparisonDatasets?.compare,
      },
    })
  }

  const onCompareSelect = (option: SelectOption) => {
    dispatch(resetReportData())
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
    <div className={activityStyles.titleRow}>
      <Select
        options={mainDatasetOptions}
        onSelect={onMainSelect} //implement later to change main dataset
        selectedOption={selectedMainDataset}
        disabled
        className={activityStyles.select}
      />
      <Select
        options={environmentalLayerOptions}
        selectedOption={selectedComparisonDatasets}
        onSelect={onCompareSelect}
        className={activityStyles.select}
      />
    </div>
  )
}

export default ReportActivityDatasetComparison
