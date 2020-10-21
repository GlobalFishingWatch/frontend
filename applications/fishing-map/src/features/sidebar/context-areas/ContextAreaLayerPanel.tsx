import React, { useState } from 'react'
import cx from 'classnames'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import { useSelector } from 'react-redux'
import useClickedOutside from 'hooks/use-clicked-outside'
import { formatInfoField } from 'utils/info'
import { Vessel } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  TrackColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import styles from 'features/sidebar/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { VESSELS_DATASET_TYPE } from 'features/workspace/workspace.mock'
import { selectResourceByUrl } from 'features/resources/resources.slice'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, VESSELS_DATASET_TYPE)
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
  const [colorOpen, setColorOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { visible: !layerActive, color },
    })
  }

  const color = dataview?.config?.color
  const changeColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { color: color.value },
    })
    setColorOpen(false)
  }

  const datasetConfig = dataview.datasetsConfig?.find(
    (dc: any) => dc?.params.find((p: any) => p.id === 'vesselId')?.value
  )

  const vesselName = resource?.data?.shipname

  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
  }
  const expandedContainerRef = useClickedOutside(closeExpandedContainer)

  const vesselId = datasetConfig?.params.find((p: any) => p.id === 'vesselId')?.value as string
  const title = vesselName || vesselId || dataview.name

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title && formatInfoField(title, 'name')}
    </h3>
  )

  return (
    <div className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen })}>
      <div className={styles.header}>
        <Switch
          active={layerActive}
          onClick={onToggleLayerActive}
          tooltip="Toggle layer visibility"
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
            tooltip={dataview.description}
            tooltipPlacement="top"
          />
          {layerActive && (
            <IconButton
              icon={colorOpen ? 'color-picker' : 'color-picker-filled'}
              size="small"
              style={colorOpen ? {} : { color: dataview.config?.color }}
              tooltip="Change color"
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
