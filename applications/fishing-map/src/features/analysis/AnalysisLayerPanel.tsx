import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/heatmaps/heatmaps.utils'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import DatasetFlagField from 'features/workspace/shared/DatasetFlagsField'
import layerPanelStyles from 'features/workspace/shared/LayerPanel.module.css'
import styles from './AnalysisLayerPanel.module.css'

const allAvailableProperties = ['dataset', 'source', 'flag']

type LayerPanelProps = {
  index: number
  dataview: UrlDataviewInstance
  hiddenProperties?: string[]
}

function AnalysisLayerPanel({ dataview, hiddenProperties }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()

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
  const showDot = !allAvailableProperties.every((property) => hiddenProperties?.includes(property))

  return (
    <div className={cx(styles.row)}>
      <div className={styles.content}>
        {showDot && <span className={styles.dot} style={{ color: dataview.config?.color }} />}
        {!hiddenProperties?.includes('dataset') && (
          <div className={layerPanelStyles.filter}>
            <label>{t('dataset.title', 'Dataset')}</label>
            {datasetName.length > 24 ? (
              <Tooltip content={datasetName}>{TitleComponent}</Tooltip>
            ) : (
              TitleComponent
            )}
          </div>
        )}
        {!hiddenProperties?.includes('source') && <DatasetFilterSource dataview={dataview} />}
        {!hiddenProperties?.includes('flag') && (
          <DatasetFlagField dataview={dataview} showWhenEmpty />
        )}
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
        {/* <AnalysisFilter
          label={t('analysis.area', 'Area')}
          taglist={areaItems}
          color={dataview?.config?.color}
        /> */}
      </div>
    </div>
  )
}

export default AnalysisLayerPanel
