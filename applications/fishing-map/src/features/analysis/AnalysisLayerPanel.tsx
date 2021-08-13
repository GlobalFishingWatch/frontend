import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { isFishingDataview, isPresenceDataview } from 'features/workspace/activity/activity.utils'
import DatasetSchemaField from 'features/workspace/shared/DatasetSchemaField'
import DatasetFilterSource from 'features/workspace/shared/DatasetSourceField'
import DatasetFlagField from 'features/workspace/shared/DatasetFlagsField'
import layerPanelStyles from 'features/workspace/shared/LayerPanel.module.css'
import { removeDatasetVersion, SupportedDatasetSchema } from 'features/datasets/datasets.utils'
import styles from './AnalysisLayerPanel.module.css'

const allAvailableProperties = ['dataset', 'source', 'flag']

type LayerPanelProps = {
  index: number
  dataview: UrlDataviewInstance
  hiddenProperties?: string[]
  availableFields: string[][]
}

function AnalysisLayerPanel({ dataview, hiddenProperties, availableFields }: LayerPanelProps) {
  const { t } = useTranslation()

  const fishignDataview = isFishingDataview(dataview)
  const presenceDataview = isPresenceDataview(dataview)
  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Fourwings)

  let datasetName = dataset
    ? t(`datasets:${removeDatasetVersion(dataset.id)}.name` as any, dataset.name)
    : dataview.name || ''
  if (fishignDataview || presenceDataview) {
    datasetName = presenceDataview
      ? t(`common.presence`, 'Vessel presence')
      : t(`common.apparentFishing`, 'Apparent Fishing Effort')
  }
  const TitleComponent = <p className={styles.dataset}>{datasetName}</p>
  const showDot = !allAvailableProperties.every((property) => hiddenProperties?.includes(property))

  const areAllPropertiesHidden =
    hiddenProperties?.includes('dataset') &&
    hiddenProperties?.includes('source') &&
    hiddenProperties?.includes('flag')

  if (areAllPropertiesHidden) {
    // TODO I don't understand that logic
    // return null
  }

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
        {availableFields.map((field) => {
          return hiddenProperties?.includes(field[0]) ? null : (
            <DatasetSchemaField
              key={field[0]}
              dataview={dataview}
              field={field[0] as SupportedDatasetSchema}
              label={t(field[1] as any, field[2])}
            />
          )
        })}
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
