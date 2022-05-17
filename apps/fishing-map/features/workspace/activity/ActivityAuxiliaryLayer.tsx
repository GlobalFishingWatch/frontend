import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DatasetTypes, ResourceStatus } from '@globalfishingwatch/api-types'
import {
  resolveDataviewDatasetResource,
  selectResources,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Spinner, Switch, Tooltip } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import Title from 'features/workspace/common/Title'
import styles from './ActivityAuxiliaryLayer.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function ActivityAuxiliaryLayer({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const resources = useSelector(selectResources)
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const auxiliarLayerActive = dataview?.config?.auxiliarLayerActive ?? true
  const { dataset, url, key } = resolveDataviewDatasetResource(
    dataview,
    DatasetTypes.TemporalContext
  )
  if (!dataset || !url) {
    return null
  }

  const resource = resources[key] || resources[url]

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
        {resource?.status === ResourceStatus.Loading && <Spinner size="tiny" />}
      </div>
    </div>
  )
}

export default ActivityAuxiliaryLayer
