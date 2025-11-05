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

  const onMainSelect = (option: SelectOption) => {
    console.log('🚀 ~ TODO: implement main dataset selection ~ option:', option)
  }

  const onCompareSelect = (option: SelectOption) => {
    dispatch(resetReportData())
    const layerConfig = LAYERS_LIBRARY_ENVIRONMENT.find((layer) => layer.id === option.id)
    if (!layerConfig) return
    const dataviewID = `${option.id}${LAYER_LIBRARY_ID_SEPARATOR}${DATASET_COMPARISON_SUFFIX}`
    const { category, dataviewId, datasetsConfig, config } = layerConfig
    removeDataviewInstance(comparisonDatasets.compare)
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
      reportComparisonDataviewIds: [dataviewID],
    })
  }

  // TODO: implement main dataset selection
  const mainDatasetOptions = reportDataviews.map((dataview) => ({
    id: dataview.id,
    label: getDatasetTitleByDataview(dataview, { showPrivateIcon: false }),
  }))
  const selectedMainDataset = mainDatasetOptions[0]
  const selectedDataview = comparedDataset?.map((id) => id.split(LAYER_LIBRARY_ID_SEPARATOR)[0])
  const selectedComparedDataset = environmentalLayerOptions.find((layer) =>
    selectedDataview?.includes(layer.id)
  )

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
        selectedOption={selectedComparedDataset}
        onSelect={onCompareSelect}
        className={activityStyles.select}
      />
    </div>
  )
}

export default ReportActivityDatasetComparison
