import { useTranslation } from 'react-i18next'

import { DatasetTypes } from '@globalfishingwatch/api-types'
import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { resolveDataviewDatasetResource } from '@globalfishingwatch/dataviews-client'
import { AUXILIAR_DATAVIEW_SUFIX, useGetDeckLayer } from '@globalfishingwatch/deck-layer-composer'
import type { AnyDeckLayer } from '@globalfishingwatch/deck-layers'
import { Spinner, Switch } from '@globalfishingwatch/ui-components'

import { getDatasetNameTranslated } from 'features/i18n/utils.datasets'
import Title from 'features/workspace/shared/Title'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'

import styles from './ActivityAuxiliaryLayer.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function ActivityAuxiliaryLayer({ dataview }: LayerPanelProps) {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const auxiliarLayerActive = dataview?.config?.auxiliarLayerActive ?? true
  const { dataset } = resolveDataviewDatasetResource(dataview, DatasetTypes.TemporalContext)
  const layer = useGetDeckLayer<AnyDeckLayer>(`${dataview.id}-${AUXILIAR_DATAVIEW_SUFIX}`)
  const isLayerLoaded = layer?.loaded

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
        <Title
          title={datasetTitle}
          className={styles.name}
          classNameActive={styles.active}
          dataview={dataview}
          onToggle={onAuxiliarLayerSwitchToggle}
        />
        {auxiliarLayerActive && !isLayerLoaded && <Spinner size="tiny" />}
      </div>
    </div>
  )
}

export default ActivityAuxiliaryLayer
