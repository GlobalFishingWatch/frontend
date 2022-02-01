import React, { Fragment, useState, useCallback, useMemo } from 'react'
import { scaleLinear } from 'd3-scale'
import kebabCase from 'lodash/kebabCase'
import { event as uaEvent } from 'react-ga'
import cx from 'classnames'
import turfBbox from '@turf/bbox'
import { stringify } from 'qs'
import GFWAPI from '@globalfishingwatch/api-client'
import { useSmallScreen } from 'hooks/screen.hooks'
import { formatUTCDate } from 'utils'
import { getGeojsonBetweenTimestamps, getCoordinatesForBounds } from 'utils/map'
import { Event, Vessel } from 'types/api/models'
import { ReactComponent as IconTarget } from 'assets/icons/target.svg'
import { ReactComponent as IconDownload } from 'assets/icons/download.svg'
import Loader from 'components/loader/loader'
import { TrackGeometry, CoordinatePosition } from 'types/app.types'
import { EVENT_TYPES, DOWNLOAD_NAME_PREFIX, DATE_FORMAT } from 'data/constants'
import Tooltip from 'components/tooltip/tooltip'
import styles from './map-legend.module.css'

interface MapLegendProps {
  zoom: number
  track: TrackGeometry | null
  vessel: Vessel | null
  vesselId: string
  hasVesselSelected: boolean
  className?: string
  currentEvent: Event | null
  setMapCoordinates: (coordinates: CoordinatePosition, zoom: number) => void
  downloadLinks: { main: string; encounter: string }
  trackInspectorLinkParams: null | { baseUrl?: string; params: any }
  loadingVesselTrack: boolean
  loadingEncounterVesselTrack: boolean
  mapDimensions: { width: number; height: number } | null
  coordinates?: CoordinatePosition | null
  heatmapLegend: { ramp: number[][]; area: number } | null
  heatmapCurrentValue?: number | null
}

type DownloadLoadingVesselType = 'carrier' | 'encounter'

type HeatmapMapLegendProps = {
  ramp: number[][]
  area: number
  currentValue?: number | null
}
const HeatmapLegend: React.FC<HeatmapMapLegendProps> = ({ ramp, area, currentValue }) => {
  const heatmapLegendScale = useMemo(() => {
    if (!ramp) return null

    return scaleLinear()
      .range(ramp.map((item, i) => (i * 100) / (ramp.length - 1)))
      .domain(ramp.map(([value]) => value))
  }, [ramp])

  if (!ramp) return null
  const areaParsed = area > 100000 ? area / 1000000 : area
  return (
    <div className={styles.legendEventContainer}>
      <div className={styles.legendHeatmap}>
        <span className={styles.legendTitle}> Carrier activity </span>
        <span className={styles.legendDimmed}>
          Detections by {areaParsed.toLocaleString('en-EN')} {area > 100000 ? 'km' : 'm'}
          <sup>2</sup>
        </span>
        <div className={styles.legendHeatmapContent}>
          <div
            className={styles.legendHeatmapContentRamp}
            style={{
              backgroundImage: `linear-gradient(to right, ${ramp
                .map(([value, color]) => color)
                .join()})`,
            }}
          >
            {currentValue && (
              <span
                className={styles.legendHeatmapCurrentValue}
                style={{
                  left:
                    heatmapLegendScale && currentValue
                      ? `${Math.min(heatmapLegendScale(currentValue) as number, 100)}%`
                      : 0,
                }}
              >
                {currentValue}
              </span>
            )}
          </div>
          <div className={styles.legendHeatmapContentSteps}>
            {ramp.map(([value], i) => {
              if (value === null) return null
              return (
                <span
                  className={styles.legendHeatmapContentStep}
                  style={{ left: `${(i * 100) / (ramp.length - 1)}%` }}
                  key={i}
                >
                  {(i === ramp.length - 1 ? '≥ ' : '') +
                    (value >= 1000 ? `${value / 1000} k` : value)}
                </span>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

const getEventBounds = (
  zoom: number,
  currentEvent: Event | null,
  track: TrackGeometry | null,
  mapDimensions: { width: number; height: number } | null
) => {
  let mapCoordinates
  let mapBounds
  let mapZoom = zoom

  if (currentEvent) {
    const eventCoordinates = {
      latitude: currentEvent.position.lat,
      longitude: currentEvent.position.lon,
    }
    if (currentEvent.type === 'port') {
      mapCoordinates = eventCoordinates
    } else if (
      track &&
      (currentEvent.type === EVENT_TYPES.encounter || currentEvent.type === EVENT_TYPES.loitering)
    ) {
      const encounterTrack: any = getGeojsonBetweenTimestamps(
        track,
        currentEvent.start,
        currentEvent.end
      )
      const hasFeatures =
        encounterTrack &&
        encounterTrack.features.length &&
        encounterTrack.features[0].geometry.coordinates.length > 0
      if (hasFeatures) {
        mapBounds = turfBbox(encounterTrack)
      } else {
        mapCoordinates = eventCoordinates
      }
    }
  }
  if (mapBounds && mapDimensions) {
    const [minLng, minLat, maxLng, maxLat] = mapBounds
    const mapModuleBounds = { minLng, minLat, maxLng, maxLat }
    const { coordinates, zoom } = getCoordinatesForBounds(mapDimensions, mapModuleBounds, 150)
    mapCoordinates = coordinates
    mapZoom = Math.max(zoom, 0)
  }

  return { mapCoordinates, mapZoom }
}

const MapLegend: React.FC<MapLegendProps> = ({
  zoom,
  track,
  vessel,
  vesselId,
  hasVesselSelected,
  currentEvent,
  className = '',
  trackInspectorLinkParams,
  downloadLinks,
  mapDimensions,
  setMapCoordinates,
  loadingVesselTrack,
  loadingEncounterVesselTrack,
  heatmapCurrentValue,
  heatmapLegend,
}) => {
  const [downloadLoading, setDownloadLoading] = useState<DownloadLoadingVesselType | null>(null)
  const isSmallScreen = useSmallScreen()

  const carrierLoading = loadingVesselTrack || downloadLoading === 'carrier'
  const encounterLoading = loadingEncounterVesselTrack || downloadLoading === 'encounter'

  const onDownloadClick = useCallback(
    async (downloadUrl: string, vesselName: string, vesselType: DownloadLoadingVesselType) => {
      setDownloadLoading(vesselType)
      const start = formatUTCDate(Date.now(), DATE_FORMAT)
      const end = formatUTCDate(Date.now(), DATE_FORMAT)
      const fileName = `${DOWNLOAD_NAME_PREFIX}-${kebabCase(vesselName)}-${start}-${end}.geo.json`
      await GFWAPI.download(downloadUrl, fileName)
      setDownloadLoading(null)
      uaEvent({
        category: 'CVP - Vessel History',
        action: 'Download Track',
        label: vesselType,
      })
    },
    []
  )

  const handleTargetClick = useCallback(() => {
    const { mapCoordinates, mapZoom } = getEventBounds(zoom, currentEvent, track, mapDimensions)

    if (mapCoordinates) {
      setMapCoordinates(mapCoordinates, mapZoom)
    }
  }, [currentEvent, mapDimensions, setMapCoordinates, track, zoom])

  const handleTrackInspectorButtonClick = useCallback(() => {
    if (!trackInspectorLinkParams || isSmallScreen) return
    uaEvent({
      category: 'CVP - Vessel History',
      action: 'Click SEE MORE Go to track inspector',
      label: currentEvent?.type,
    })
    const { baseUrl, params } = trackInspectorLinkParams
    const { mapCoordinates, mapZoom } = getEventBounds(zoom, currentEvent, track, mapDimensions)

    const finalParams = mapCoordinates ? { ...params, ...mapCoordinates, zoom: mapZoom } : params
    const urlParams = stringify(finalParams)
    const url = baseUrl ? `${baseUrl}?${urlParams}` : ''
    if (url) {
      window.open(url, '_blank')
    }
  }, [currentEvent, isSmallScreen, mapDimensions, track, trackInspectorLinkParams, zoom])

  const isEncounter = currentEvent && currentEvent.type === EVENT_TYPES.encounter
  const encounterVesselname =
    currentEvent?.encounter?.vessel.name || currentEvent?.encounter?.vessel.ssvid || ''
  const showTargetBtn =
    currentEvent &&
    mapDimensions &&
    ((isEncounter && !loadingVesselTrack && !loadingEncounterVesselTrack) || !isEncounter)

  return (
    <div
      className={cx(
        styles.legendContainer,
        { [styles.legendContainerFloating]: heatmapLegend },
        className
      )}
    >
      {(heatmapLegend || hasVesselSelected) && (
        <div className={cx(styles.legendContent, className)}>
          {hasVesselSelected && (
            <div className={styles.legendEventContainer}>
              <div className={styles.legendLabelsContainer}>
                <div>
                  <div className={styles.legendEventLineContainer}>
                    <span className={styles.mainVesselLine}>
                      {carrierLoading ? <Loader mini carrier /> : <span />}
                    </span>
                    <span className={styles.legendLabel}>
                      {loadingVesselTrack ? (
                        'Loading vessel information'
                      ) : (
                        <Fragment>
                          {vessel?.name || vessel?.ssvid || vesselId}{' '}
                          {!carrierLoading && vessel?.name && (
                            <button
                              className={styles.downloadLink}
                              aria-label="Download track (geojson)"
                              data-tip-pos="top"
                              onClick={() =>
                                onDownloadClick(downloadLinks.main, vessel.name, 'carrier')
                              }
                            >
                              <IconDownload className={styles.downloadIcon} />
                            </button>
                          )}
                        </Fragment>
                      )}
                    </span>
                  </div>
                  {isEncounter && (
                    <div className={styles.legendEventLineContainer}>
                      <span
                        className={styles.encounterVesselLine}
                        aria-label="Track shows the month prior to the encounter"
                      >
                        {encounterLoading ? <Loader mini encounter /> : <span />}
                      </span>
                      <span className={styles.legendLabel}>
                        {currentEvent?.encounter && loadingEncounterVesselTrack ? (
                          'Loading encountered vessel track'
                        ) : (
                          <Fragment>
                            <span>
                              {encounterVesselname}{' '}
                              <span className={styles.legendLabelSecondary}>
                                (30 days before and 7 after)
                              </span>
                            </span>
                            {!encounterLoading && (
                              <button
                                className={styles.downloadLink}
                                aria-label="Download track (geojson)"
                                data-tip-pos="top"
                                onClick={() =>
                                  onDownloadClick(
                                    downloadLinks.encounter,
                                    encounterVesselname,
                                    'encounter'
                                  )
                                }
                              >
                                <IconDownload className={styles.downloadIcon} />
                              </button>
                            )}
                          </Fragment>
                        )}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className={styles.positionDisclaimer}>Event positions are approximated</span>
            </div>
          )}
          {heatmapLegend !== null && (
            <HeatmapLegend
              ramp={heatmapLegend.ramp}
              area={heatmapLegend.area}
              currentValue={heatmapCurrentValue}
            />
          )}
          {(showTargetBtn || trackInspectorLinkParams) && (
            <div className={styles.legendActionContainer}>
              {showTargetBtn && (
                <button
                  onClick={handleTargetClick}
                  aria-label={
                    isEncounter
                      ? 'Show vessel positions during encounter (thicker lines)'
                      : 'Center map on event'
                  }
                  className={styles.actionButton}
                >
                  <IconTarget className={styles.actionIcon} />
                </button>
              )}
              {trackInspectorLinkParams && (
                <Tooltip content={isSmallScreen ? 'Only available in desktop' : ''}>
                  <button
                    className={cx(styles.actionLink, {
                      [styles.disabled]: isSmallScreen,
                    })}
                    onClick={handleTrackInspectorButtonClick}
                    role="link"
                  >
                    See More
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MapLegend
