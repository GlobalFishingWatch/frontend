import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { TagItem } from '@globalfishingwatch/ui-components/dist/tag-list'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from 'types'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import DatasetFlagField from 'features/workspace/shared/DatasetFlagsField'
import layerPanelStyles from 'features/workspace/shared/LayerPanel.module.css'
import styles from './AnalysisLayerPanel.module.css'
import { selectAnalysisAreaName } from './analysis.slice'
import AnalysisFilter from './AnalysisFilter'

type LayerPanelProps = {
  index: number
  dataview: UrlDataviewInstance
}

function AnalysisLayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const analysisAreaName = useSelector(selectAnalysisAreaName)
  const fishignDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)

  let datasetName = dataset ? t(`datasets:${dataset?.id}.name` as any) : dataview.name || ''
  if (fishignDataview || presenceDataview) {
    datasetName = presenceDataview
      ? t(`common.presence`, 'Fishing presence')
      : t(`common.apparentFishing`, 'Apparent Fishing Effort')
  }
  const TitleComponent = <p className={styles.dataset}>{datasetName}</p>

  const areaItems: TagItem[] = [
    {
      id: 'area',
      label:
        analysisAreaName.length > 35 ? `${analysisAreaName.slice(0, 35)}...` : analysisAreaName,
      tooltip: analysisAreaName,
    },
  ]

  return (
    <div className={cx(styles.row)}>
      <div className={styles.content}>
        <span className={styles.dot} style={{ color: dataview.config?.color }}></span>
        <div className={layerPanelStyles.filter}>
          <label>{t('dataset.title', 'Dataset')}</label>
          {datasetName.length > 24 ? (
            <Tooltip content={datasetName}>{TitleComponent}</Tooltip>
          ) : (
            TitleComponent
          )}
        </div>
        <DatasetFilterSource dataview={dataview} />
        <DatasetFlagField dataview={dataview} />
        <DatasetSchemaField
          dataview={dataview}
          field={'geartype'}
          label={t('layer.gearType_plural', 'Gear types')}
        />
        <DatasetSchemaField
          dataview={dataview}
          field={'fleet'}
          label={t('layer.fleet_plural', 'Fleets')}
        />
        <DatasetSchemaField
          dataview={dataview}
          field={'vessel_type'}
          label={t('vessel.vesselType_plural', 'Vessel types')}
        />
        <AnalysisFilter
          label={t('analysis.area', 'Area')}
          taglist={areaItems}
          color={dataview?.config?.color}
        />
      </div>
    </div>
  )
}

export default AnalysisLayerPanel
