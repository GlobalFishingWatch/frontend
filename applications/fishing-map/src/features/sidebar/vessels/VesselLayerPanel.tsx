import React, { useState } from 'react'
import cx from 'classnames'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import { useSelector } from 'react-redux'
import useClickedOutside from 'hooks/use-clicked-outside'
import { formatInfoField, formatInfoLabel } from 'utils/info'
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
import I18nDate from 'features/i18n/i18nDate'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, VESSELS_DATASET_TYPE)
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { visible: !layerActive, color },
    })
  }

  const color = dataview?.config?.color
  const changeTrackColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: { color: color.value },
    })
    setColorOpen(false)
  }

  const onRemoveLayerClick = () => {
    deleteDataviewInstance(dataview.id)
  }

  const datasetConfig = dataview.datasetsConfig?.find(
    (dc: any) => dc?.params.find((p: any) => p.id === 'vesselId')?.value
  )

  const vesselName = resource?.data?.shipname

  const onToggleColorOpen = () => {
    setColorOpen(!colorOpen)
  }
  const onToggleInfoOpen = () => {
    setInfoOpen(!infoOpen)
  }

  const closeExpandedContainer = () => {
    setColorOpen(false)
    setInfoOpen(false)
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
    <div
      className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen || infoOpen })}
    >
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
            tooltip="info"
            onClick={onToggleInfoOpen}
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
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip="Delete"
            tooltipPlacement="top"
            onClick={onRemoveLayerClick}
          />
        </div>
      </div>
      <div className={styles.expandedContainer} ref={expandedContainerRef}>
        {colorOpen && (
          <ColorBar
            colorBarOptions={TrackColorBarOptions}
            selectedColor={dataview.config?.color}
            onColorClick={changeTrackColor}
          />
        )}
        {infoOpen && (
          <ul className={styles.infoContent}>
            {dataview.infoConfig?.fields.map((field) => {
              const fieldValue = resource?.data?.[field.id as keyof Vessel]
              if (!fieldValue) return null
              return (
                <li key={field.id} className={styles.infoContentItem}>
                  <label>{formatInfoLabel(field.id)}</label>
                  <span>
                    {field.type === 'date' ? (
                      <I18nDate date={field.id} />
                    ) : (
                      formatInfoField(fieldValue, field.type)
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LayerPanel
