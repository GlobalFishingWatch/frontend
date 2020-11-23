import React, { useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { fitBounds } from 'viewport-mercator-project'
import { Vessel } from '@globalfishingwatch/api-types'
import { Switch, IconButton, Tooltip, ColorBar } from '@globalfishingwatch/ui-components'
import {
  ColorBarOption,
  TrackColorBarOptions,
} from '@globalfishingwatch/ui-components/dist/color-bar'
import {
  Segment,
  segmentsToBbox,
  filterSegmentsByTimerange,
} from '@globalfishingwatch/data-transforms'
import { formatInfoField } from 'utils/info'
import useClickedOutside from 'hooks/use-clicked-outside'
import { UrlDataviewInstance, AsyncReducerStatus } from 'types'
import styles from 'features/sidebar/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { TRACKS_DATASET_TYPE, VESSELS_DATASET_TYPE } from 'data/datasets'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { useMapboxInstance } from 'features/map/map.context'
import useViewport from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'

// Translations by feature.unit static keys
// t('vessel.flag', 'Flag')
// t('vessel.imo', 'IMO')
// t('vessel.first_transmission_date', 'First transmission date')
// t('vessel.last_transmission_date', 'Last transmission date')

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const mapInstance = useMapboxInstance()
  const { setMapCoordinates } = useViewport()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, { type: VESSELS_DATASET_TYPE })
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, { type: TRACKS_DATASET_TYPE })
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
  const { start, end } = useTimerangeConnect()
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))
  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data) {
      const filteredSegments = filterSegmentsByTimerange(trackResource?.data, { start, end })
      const bbox = segmentsToBbox(filteredSegments)
      const { width, height } = mapInstance?._canvas || {}
      if (width && height && bbox) {
        const [minLng, minLat, maxLng, maxLat] = bbox
        const { latitude, longitude, zoom } = fitBounds({
          bounds: [
            [minLng, minLat],
            [maxLng, maxLat],
          ],
          width,
          height,
          padding: 60,
        })
        setMapCoordinates({ latitude, longitude, zoom })
      }
    }
  }, [mapInstance, setMapCoordinates, trackResource, start, end])

  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
  }

  const changeTrackColor = (color: ColorBarOption) => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        color: color.value,
      },
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
            icon="target"
            size="small"
            className={styles.actionButton}
            tooltip={t('layer.vessel_fit_bounds', 'Center view on vessel track')}
            onClick={onFitBoundsClick}
            tooltipPlacement="top"
          />
          <IconButton
            icon="info"
            size="small"
            loading={resource?.status === AsyncReducerStatus.Loading}
            className={styles.actionButton}
            tooltip={
              infoOpen ? t('layer.info_close', 'Hide info') : t('layer.info_open', 'Show info')
            }
            onClick={onToggleInfoOpen}
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
          <IconButton
            icon="delete"
            size="small"
            className={styles.actionButton}
            tooltip={t('layer.remove', 'Remove layer')}
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
            {dataview.infoConfig?.fields.map((field: any) => {
              const fieldValue = resource?.data?.[field.id as keyof Vessel]
              if (!fieldValue) return null
              return (
                <li key={field.id} className={styles.infoContentItem}>
                  <label>{t(`vessel.${field.id}`)}</label>
                  <span>
                    {field.type === 'date' ? (
                      <I18nDate date={fieldValue} />
                    ) : field.type === 'flag' ? (
                      <I18nFlag iso={fieldValue} />
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
