import React, { Fragment, useMemo, useState } from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { EndpointId } from '@globalfishingwatch/api-types'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Switch, Tooltip } from '@globalfishingwatch/ui-components'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { getDatasetNameTranslated } from 'features/i18n/utils'
import Title from 'features/workspace/common/Title'
import styles from './ActivitySubLayerPanel.module.css'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function ActivityLayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const subLayerActive = dataview?.config?.subLayerActive ?? true
  console.log(dataview)
  const subLayerConfig = dataview.datasetsConfig?.find(
    (d) => d.endpoint === EndpointId.ContextGeojson
  )
  if (!subLayerConfig) {
    return null
  }
  const dataset = dataview.datasets?.find((d) => d.id === subLayerConfig.datasetId)
  if (!dataset) {
    return null
  }

  const onSubLayerSwitchToggle = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        subLayerActive: !subLayerActive,
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
      onToggle={onSubLayerSwitchToggle}
    />
  )

  return (
    <div>
      <div className={styles.header}>
        <Switch
          size="mini"
          active={subLayerActive}
          onClick={onSubLayerSwitchToggle}
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
      </div>
    </div>
  )
}

export default ActivityLayerPanel
