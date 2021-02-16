import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Vessel, DatasetTypes } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  HeatmapColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import styles from 'features/workspace/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import { selectUserId } from 'features/user/user.selectors'
import ExpandedContainer from '../ExpandedContainer'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Vessels })
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
  const userId = useSelector(selectUserId)
  const [colorOpen, setColorOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
  }

  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
        colorRamp: color.id,
      },
    })
    setColorOpen(false)
  }
  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }

  const onRemoveClick = () => {
    deleteDataviewInstance(dataview.id)
  }

  const dataset = dataview.datasets?.find(
    (d) => d.type === DatasetTypes.Fourwings || d.type === DatasetTypes.Context
  )
  const isCustomUserLayer = dataset?.ownerId === userId

  const title = isCustomUserLayer ? dataset?.name || dataset?.id : t(`datasets:${dataset?.id}.name`)
  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  return (
    <div
      className={cx(styles.LayerPanel, {
        [styles.expandedContainerOpen]: colorOpen,
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
            size="small"
            loading={resource?.status === AsyncReducerStatus.Loading}
            className={styles.actionButton}
            tooltip={t(`datasets:${dataset?.id}.description`)}
            tooltipPlacement="top"
          />
          {layerActive && (
            <ExpandedContainer
              visible={colorOpen}
              onClickOutside={closeExpandedContainer}
              component={
                <ColorBar
                  colorBarOptions={HeatmapColorBarOptions}
                  selectedColor={dataview.config?.color}
                  onColorClick={changeColor}
                />
              }
            >
              <IconButton
                icon={colorOpen ? 'color-picker' : 'color-picker-filled'}
                size="small"
                style={colorOpen ? {} : { color: dataview.config?.color }}
                tooltip={t('layer.color_change', 'Change color')}
                tooltipPlacement="top"
                onClick={onToggleColorOpen}
                className={styles.actionButton}
              />
            </ExpandedContainer>
          )}
          {isCustomUserLayer && (
            <IconButton
              icon="delete"
              size="small"
              tooltip={t('layer.remove', 'Remove layer')}
              tooltipPlacement="top"
              onClick={onRemoveClick}
              className={cx(styles.actionButton)}
            />
          )}
        </div>
      </div>

      {layerActive && (
        <div className={styles.properties}>
          <div id={`legend_${dataview.id}`}></div>
        </div>
      )}
    </div>
  )
}

export default LayerPanel
