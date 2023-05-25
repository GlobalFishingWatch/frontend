import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Spinner, Switch, Tooltip } from '@globalfishingwatch/ui-components'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import Title from 'features/workspace/common/Title'
import { useMapSourceTilesLoaded } from 'features/map/map-sources.hooks'
import styles from './ActivityAuxiliaryLayer.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function ActivityAuxiliaryLayer({ dataview }: LayerPanelProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const auxiliarLayerActive = dataview?.config?.auxiliarLayerActive ?? true
  const { dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.TemporalContext)
  const layerLoaded = useMapSourceTilesLoaded(dataview.id)
  const isLayerLoadedDebounced = useDebounce(layerLoaded, 200)

  if (!dataset) {
    return null
  }

  const onAuxiliarLayerSwitchToggle = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        auxiliarLayerActive: !auxiliarLayerActive,
      },
    })
  }

  const datasetTitle = getDatasetNameTranslated(dataset)
  const TitleComponent = (
    <Title
      title={datasetTitle}
      className={styles.name}
      classNameActive={styles.active}
      dataview={dataview}
      onToggle={onAuxiliarLayerSwitchToggle}
    />
  )

  return (
    <div>
      <div className={styles.header}>
        <Switch
          size="small"
          active={auxiliarLayerActive}
          onClick={onAuxiliarLayerSwitchToggle}
          tooltip={t('layer.toggleVisibility', 'Toggle layer visibility')}
          tooltipPlacement="top"
          className={styles.switch}
          color={dataview.config?.color}
        />
        {datasetTitle.length > 24 ? (
          <Tooltip content={datasetTitle}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        {auxiliarLayerActive && !isLayerLoadedDebounced && <Spinner size="tiny" />}
      </div>
    </div>
  )
}

export default ActivityAuxiliaryLayer
