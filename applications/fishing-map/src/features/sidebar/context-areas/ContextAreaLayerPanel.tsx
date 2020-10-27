import React, { useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import useClickedOutside from 'hooks/use-clicked-outside'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import { Vessel } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  TrackColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import styles from 'features/sidebar/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { VESSELS_DATASET_TYPE, USER_CONTEXT_TYPE } from 'data/datasets'
import { selectResourceByUrl } from 'features/resources/resources.slice'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, VESSELS_DATASET_TYPE)
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
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
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)

  const dataset = dataview.datasets?.find((d) => d.type === USER_CONTEXT_TYPE)
  const title = t(`datasets:${dataset?.id}.name`)

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen })}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip={t('layer.toggle_visibility', 'Toggle layer visibility')}
          tooltipPlacement="top"
          color={dataview.config?.color}
        />
        {title && title.length > 30 ? (
          <Tooltip content={title}>{TitleComponent}</Tooltip>
        ) : (
          TitleComponent
        )}
        <div className={cx(styles.actions, { [styles.active]: layerActive })}>
          <IconButton
            icon="info"
            size="small"
            loading={resource?.status === AsyncReducerStatus.Loading}
            className={styles.actionButton}
            tooltip={t(`datasets:${dataset?.id}.description`)}
            tooltipPlacement="top"
          />
          {layerActive && (
            <IconButton
              icon={colorOpen ? 'color-picker' : 'color-picker-filled'}
              size="small"
              style={colorOpen ? {} : { color: dataview.config?.color }}
              tooltip={t('layer.color_change', 'Change color')}
              tooltipPlacement="top"
              onClick={onToggleColorOpen}
              className={cx(styles.actionButton, styles.expandable, {
                [styles.expanded]: colorOpen,
              })}
            />
          )}
        </div>
      </div>
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {colorOpen && (
          <ColorBar
            colorBarOptions={TrackColorBarOptions}
            selectedColor={dataview.config?.color}
            onColorClick={changeColor}
          />
        )}
      </div>
    </div>
  )
}

export default LayerPanel
