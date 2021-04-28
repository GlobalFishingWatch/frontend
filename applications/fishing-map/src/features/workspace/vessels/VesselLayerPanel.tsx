import React, { Fragment, useCallback, useState } from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { DatasetTypes, ResourceStatus, Vessel } from '@globalfishingwatch/api-types'
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
import {
  UrlDataviewInstance,
  resolveDataviewDatasetResource,
} from '@globalfishingwatch/dataviews-client'
import { EMPTY_FIELD_PLACEHOLDER, formatInfoField, getVesselLabel } from 'utils/info'
import styles from 'features/workspace/shared/LayerPanel.module.css'
import { useDataviewInstancesConnect } from 'features/workspace/workspace.hook'
import { selectResourceByUrl } from 'features/resources/resources.slice'
import I18nDate from 'features/i18n/i18nDate'
import I18nFlag from 'features/i18n/i18nFlag'
import { useMapFitBounds } from 'features/map/map-viewport.hooks'
import { useTimerangeConnect } from 'features/timebar/timebar.hooks'
import ExpandedContainer from 'features/workspace/shared/ExpandedContainer'
import { Bbox } from 'types'

type LayerPanelProps = {
  dataview: UrlDataviewInstance
}

const showDebugVesselId = process.env.NODE_ENV === 'development'
const mandatory_fields = ['shipname', 'flag', 'mmsi', 'imo', 'callsign', 'geartype', 'source']

function LayerPanel({ dataview }: LayerPanelProps): React.ReactElement {
  const { t } = useTranslation()
  const fitBounds = useMapFitBounds()
  const { start, end } = useTimerangeConnect()
  const { upsertDataviewInstance, deleteDataviewInstance } = useDataviewInstancesConnect()
  const { url: infoUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Vessels)
  const { url: trackUrl } = resolveDataviewDatasetResource(dataview, DatasetTypes.Tracks)
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
    trackResource?.status === ResourceStatus.Loading ||
    infoResource?.status === ResourceStatus.Loading

  const infoError = infoResource?.status === ResourceStatus.Error
  const trackError = trackResource?.status === ResourceStatus.Error

  const getFieldValue = (field: any, fieldValue: string | undefined) => {
    if (!fieldValue) return
    if (field.type === 'date') {
      return <I18nDate date={fieldValue} />
    }
    if (field.type === 'flag') {
      return <I18nFlag iso={fieldValue} />
    }
    if (field.id === 'geartype') {
      return t(`vessel.gearTypes.${fieldValue}` as any, EMPTY_FIELD_PLACEHOLDER)
    }
    if (field.id === 'mmsi') {
      return (
        <a
          className={styles.link}
          target="_blank"
          rel="noreferrer"
          href={`https://www.marinetraffic.com/en/ais/details/ships/${fieldValue}`}
        >
          {formatInfoField(fieldValue, field.type)}
        </a>
      )
    }
    return formatInfoField(fieldValue, field.type)
  }

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
                      const value = infoResource?.data?.[field.id as keyof Vessel]
                      if (!value && !mandatory_fields.includes(field.id)) return null
                      const fieldValues = Array.isArray(value) ? value : [value]
                      return (
                        <li key={field.id} className={styles.infoContentItem}>
                          <label>{t(`vessel.${field.id}` as any)}</label>
                          {fieldValues.map((fieldValue, i) => (
                            <span key={fieldValue}>
                              {fieldValue ? getFieldValue(field, fieldValue) : '---'}
                              {/* Field values separator */}
                              {i < fieldValues.length - 1 ? ', ' : ''}
                            </span>
                          ))}
                        </li>
                      )
                    })}
                  </ul>
                }
              >
                <IconButton
                  size="small"
                  icon={infoError ? 'warning' : 'info'}
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
