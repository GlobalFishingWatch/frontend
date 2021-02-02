import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { fitBounds } from 'viewport-mercator-project'
import { DatasetTypes, Vessel } from '@globalfishingwatch/api-types'
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
import styles from 'features/workspace/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { useMapboxInstance } from 'features/map/map.context'
import useViewport from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import { DATAVIEW_INSTANCE_PREFIX } from 'features/dataviews/dataviews.utils'

// Translations by feature.unit static keys
// t('vessel.flag', 'Flag')
// t('vessel.imo', 'IMO')
// t('vessel.firstTransmissionDate', 'First transmission date')
// t('vessel.lastTransmissionDate', 'Last transmission date')
// t('vessel.registeredGearType', 'Registered Gear Type')
// t('vessel.widthRange', 'Width range')
// t('vessel.lengthRange', 'Length range')
// t('vessel.grossTonnageRange', 'Gross Tonnage range')
// t('vessel.fleet', 'Fleet')
// t('vessel.source', 'Source')

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const mapInstance = useMapboxInstance()
  const { setMapCoordinates } = useViewport()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Vessels })
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Tracks })
  const resource = useSelector(selectResourceByUrl<Vessel>(url))
  const { start, end } = useTimerangeConnect()
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))
  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data) {
      const filteredSegments = filterSegmentsByTimerange(trackResource?.data, { start, end })
      const bbox = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
      const { width, height } = (mapInstance as any)._canvas || {}
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
      } else {
        // TODO use prompt to ask user if wants to update the timerange to fit the track
        alert('The vessel has no activity in your selected timerange')
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

  const vesselId = dataview.id.replace(DATAVIEW_INSTANCE_PREFIX, '')
  const title = vesselName || vesselId || dataview.name

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {title && formatInfoField(title, 'name')}
    </h3>
  )

  const loading =
    trackResource?.status === AsyncReducerStatus.Loading ||
    resource?.status === AsyncReducerStatus.Loading

  return (
    <div
      className={cx(styles.LayerPanel, { [styles.expandedContainerOpen]: colorOpen || infoOpen })}
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
          {loading ? (
            <IconButton
              loading
              className={styles.loadingIcon}
              size="small"
              tooltip={t('vessel.loading', 'Loading vessel track')}
            />
          ) : (
            <Fragment>
              {layerActive && (
                <Fragment>
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
                  <IconButton
                    icon="target"
                    size="small"
                    className={styles.actionButton}
                    tooltip={t('layer.vessel_fit_bounds', 'Center view on vessel track')}
                    onClick={onFitBoundsClick}
                    tooltipPlacement="top"
                  />
                </Fragment>
              )}
              <IconButton
                icon="info"
                size="small"
                className={styles.actionButton}
                tooltip={
                  infoOpen ? t('layer.infoClose', 'Hide info') : t('layer.infoOpen', 'Show info')
                }
                onClick={onToggleInfoOpen}
                tooltipPlacement="top"
              />
              <IconButton
                icon="delete"
                size="small"
                className={styles.actionButton}
                tooltip={t('layer.remove', 'Remove layer')}
                tooltipPlacement="top"
                onClick={onRemoveLayerClick}
              />
            </Fragment>
          )}
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
                    ) : field.id === 'mmsi' ? (
                      <a
                        className={styles.link}
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.marinetraffic.com/en/ais/details/ships/${fieldValue}`}
                      >
                        {formatInfoField(fieldValue, field.type)}
                      </a>
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
