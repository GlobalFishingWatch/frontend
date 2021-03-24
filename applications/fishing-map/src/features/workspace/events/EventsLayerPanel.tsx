import React from 'react'
import cx from 'classnames'
import { useTranslation } from 'react-i18next'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import Switch from '@globalfishingwatch/ui-components/dist/switch'
import IconButton from '@globalfishingwatch/ui-components/dist/icon-button'
import Tooltip from '@globalfishingwatch/ui-components/dist/tooltip'
import { UrlDataviewInstance } from 'types'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import DatasetNotFound from '../shared/DatasetNotFound'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
  }

  const dataset = dataview.datasets?.find((d) => d.type === DatasetTypes.Events)

  if (!dataset) {
    return <DatasetNotFound dataview={dataview} />
  }

  const title = t(`datasets:${dataset?.id}.name` as any)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {t(`datasets:${dataset?.id}.name` as any)}
    </h3>
  )

  const infoTooltip = t(`datasets:${dataset?.id}.description` as any)

  return (
    <div
      className={cx(styles.LayerPanel, {
        'print-hidden': !layerActive,
      })}
    >
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip={t('layer.toggleVisibility', 'Toggle layer visibility')}
          tooltipPlacement="top"
          className={styles.switch}
          color={dataview.config?.color}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx('print-hidden', styles.actions, { [styles.active]: layerActive })}>
          <IconButton
            icon="info"
            type="default"
            size="small"
            className={styles.actionButton}
            tooltip={infoTooltip}
            tooltipPlacement="top"
          />
        </div>
      </div>
    </div>
  )
}

export default LayerPanel
