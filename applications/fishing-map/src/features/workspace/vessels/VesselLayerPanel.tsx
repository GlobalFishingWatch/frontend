import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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
import { formatInfoField, getVesselLabel } from 'utils/info'
import { Bbox, UrlDataviewInstance } from 'types'
import { AsyncReducerStatus } from 'utils/async-slice'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { resolveDataviewDatasetResource } from 'features/workspace/workspace.selectors'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'

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
// t('vessel.nationalId', 'National Id')
// t('vessel.length', 'Length')
// t('vessel.beam', 'Beam')
// t('vessel.capacity', 'Capacity')

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

const showDebugVesselId = process.env.NODE_ENV === 'development'

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { start, end } = useTimerangeConnect()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Vessels })
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, { type: DatasetTypes.Tracks })
  const infoResource = useSelector(selectResourceByUrl<Vessel>(infoUrl))
  const trackResource = useSelector(selectResourceByUrl<Segment[]>(trackUrl))
  const [colorOpen, setColorOpen] = useState(false)
  const [infoOpen, setInfoOpen] = useState(false)

  const onFitBoundsClick = useCallback(() => {
    if (trackResource?.data) {
      const filteredSegments = filterSegmentsByTimerange(trackResource?.data, { start, end })
      const bbox = filteredSegments?.length ? segmentsToBbox(filteredSegments) : undefined
      if (bbox) {
        fitBounds(bbox as Bbox)
      } else {
        // TODO use prompt to ask user if wants to update the timerange to fit the track
        alert('The vessel has no activity in your selected timerange')
      }
    }
  }, [fitBounds, trackResource, start, end])

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

  const vesselLabel = infoResource?.data ? getVesselLabel(infoResource.data) : ''
  const vesselId = showDebugVesselId
    ? (infoResource?.datasetConfig?.params?.find((p) => p.id === 'vesselId')?.value as string) || ''
    : ''
  const vesselTitle = vesselLabel || vesselId

  const TitleComponent = (
    <h3 className={cx(styles.name, { [styles.active]: layerActive })} onClick={onToggleLayerActive}>
      {vesselTitle}
    </h3>
  )

  const loading =
    trackResource?.status === AsyncReducerStatus.Loading ||
    infoResource?.status === AsyncReducerStatus.Loading

  const infoError = infoResource?.status === AsyncReducerStatus.Error
  const trackError = trackResource?.status === AsyncReducerStatus.Error

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
        {vesselTitle && vesselTitle.length > 20 ? (
          <Tooltip content={vesselTitle}>{TitleComponent}</Tooltip>
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
                  <ExpandedContainer
                    visible={colorOpen}
                    onClickOutside={closeExpandedContainer}
                    component={
                      <ColorBar
                        colorBarOptions={TrackColorBarOptions}
                        selectedColor={dataview.config?.color}
                        onColorClick={changeTrackColor}
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
                  <IconButton
                    size="small"
                    icon={trackError ? 'warning' : 'target'}
                    type={trackError ? 'warning' : 'default'}
                    className={styles.actionButton}
                    tooltip={
                      trackError
                        ? t('errors.trackLoading', 'There was an error loading the vessel track')
                        : t('layer.vessel_fit_bounds', 'Center view on vessel track')
                    }
                    onClick={onFitBoundsClick}
                    tooltipPlacement="top"
                  />
                </Fragment>
              )}
              <ExpandedContainer
                visible={infoOpen}
                onClickOutside={closeExpandedContainer}
                component={
                  <ul className={styles.infoContent}>
                    {dataview.infoConfig?.fields.map((field: any) => {
                      const fieldValue = infoResource?.data?.[field.id as keyof Vessel]
                      if (!fieldValue) return null
                      return (
                        <li key={field.id} className={styles.infoContentItem}>
                          <label>{t(`vessel.${field.id}` as any)}</label>
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
                }
              >
                <IconButton
                  size="small"
                  icon={infoError ? 'warning' : 'target'}
                  type={infoError ? 'warning' : 'default'}
                  className={styles.actionButton}
                  tooltip={
                    infoError
                      ? t('errors.vesselLoading', 'There was an error loading the vessel details')
                      : infoOpen
                      ? t('layer.infoClose', 'Hide info')
                      : t('layer.infoOpen', 'Show info')
                  }
                  onClick={onToggleInfoOpen}
                  tooltipPlacement="top"
                />
              </ExpandedContainer>
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
    </div>
  )
}

export default LayerPanel
