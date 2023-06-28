import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import { DeckGL, DeckGLRef } from '@deck.gl/react/typed'
import { MapView, PickingInfo, WebMercatorViewport } from '@deck.gl/core/typed'
import { useBasemapLayer } from 'layers/basemap/basemap.hooks'
import { useAtom } from 'jotai'
import { useContextsLayer } from 'layers/context/context.hooks'
import { useLatestPositionsLayer } from 'layers/latest-positions/latest-positions.hooks'
import { useTracksLayer, useTracksSublayers } from 'layers/tracks/tracks.hooks'
import { BitmapLayer } from '@deck.gl/layers/typed'
import { TileLayer } from '@deck.gl/geo-layers/typed'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { MiniGlobe, MiniglobeBounds, Tooltip } from '@globalfishingwatch/ui-components'
import { BasemapType } from '@globalfishingwatch/layer-composer'
import { useURLViewport, useViewport } from 'features/map/map-viewport.hooks'
import { hoveredFeaturesAtom } from 'features/map/map-picking.hooks'
import { getTimeAgo } from 'utils/dates'
import styles from './map.module.css'

const API_GATEWAY = 'https://gateway.api.dev.globalfishingwatch.org'
const API_GATEWAY_VERSION = 'v2'

const mapView = new MapView({ repeat: true })

export type GFWLayerProps = {
  token: string
  lastUpdate: string
}

const MapWrapper = ({ lastUpdate }): React.ReactElement => {
  useURLViewport()
  const { viewState, onViewportStateChange } = useViewport()
  const deckRef = useRef<DeckGLRef>(null)
  const basemapLayer = useBasemapLayer()
  const contextLayer = useContextsLayer()
  const tracksLayer = useTracksLayer({ token: GFWAPI.getToken(), lastUpdate })
  const latestPositionsLayer = useLatestPositionsLayer({ token: GFWAPI.getToken(), lastUpdate })
  const [hoveredFeatures, setHoveredFeatures] = useAtom(hoveredFeaturesAtom)
  const { addTrackSublayer } = useTracksSublayers()
  const [bounds, setBounds] = useState<MiniglobeBounds>()
  const [currentBasemap, setCurrentBasemap] = useState<BasemapType>(BasemapType.Satellite)
  const [labelsShown, setLabelsShown] = useState<boolean>(true)

  const layers = useMemo(() => {
    const satellite =
      currentBasemap === BasemapType.Satellite
        ? new TileLayer({
            id: 'Satellite',
            data: `${API_GATEWAY}/${API_GATEWAY_VERSION}/tileset/sat/tile?x={x}&y={y}&z={z}`,
            loadOptions: {
              fetch: {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${GFWAPI.getToken()}`,
                },
              },
            },
            renderSubLayers: (props) => {
              const { boundingBox } = props.tile
              const { data, ...rest } = props
              return new BitmapLayer({
                ...rest,
                image: props.data,
                bounds: [
                  boundingBox[0][0],
                  boundingBox[0][1],
                  boundingBox[1][0],
                  boundingBox[1][1],
                ],
                tileSize: 256,
              })
            },
          })
        : []

    const labels = labelsShown
      ? new TileLayer({
          id: 'Labels',
          data: `${API_GATEWAY}/${API_GATEWAY_VERSION}/tileset/nslabels/tile?locale=en&x={x}&y={y}&z={z}`,
          loadOptions: {
            fetch: {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${GFWAPI.getToken()}`,
              },
            },
          },
          renderSubLayers: (props) => {
            const { boundingBox } = props.tile
            const { data, ...rest } = props
            return new BitmapLayer({
              ...rest,
              image: props.data,
              bounds: [boundingBox[0][0], boundingBox[0][1], boundingBox[1][0], boundingBox[1][1]],
              tileSize: 256,
            })
          },
        })
      : []
    return [basemapLayer, satellite, contextLayer, tracksLayer, latestPositionsLayer, labels]
  }, [basemapLayer, contextLayer, currentBasemap, labelsShown, latestPositionsLayer, tracksLayer])

  const onClick = useCallback(
    (info: PickingInfo) => {
      const features = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      if (!features.length) return
      addTrackSublayer(features[0].object.properties.mmsi)
    },
    [addTrackSublayer]
  )

  const onHover = useCallback(
    (info: PickingInfo) => {
      const features = deckRef?.current?.pickMultipleObjects({
        x: info.x,
        y: info.y,
      })
      if (!hoveredFeatures.length && !features.length) return
      setHoveredFeatures(features)
    },
    [setHoveredFeatures, hoveredFeatures]
  )

  const onViewStateChange = (e) => {
    onViewportStateChange(e)
    const viewport = new WebMercatorViewport(e.viewState)
    const nw = viewport.unproject([0, 0])
    const se = viewport.unproject([viewport.width, viewport.height])
    setBounds({
      north: nw[1],
      south: se[1],
      west: nw[0],
      east: se[0],
    })
  }

  const InfoTooltip = ({ features }) => {
    const vessels = features
      .filter((f) => f.object?.properties?.mmsi)
      .sort((a, b) => b.object?.properties?.timestamp - a.object?.properties?.timestamp)
    const count = features[0]?.object?.properties?.count
    const mapWidth = window.innerWidth - 320
    if (vessels.length > 0 || count) {
      return (
        <div
          style={{
            font: 'var(--font-S)',
            position: 'absolute',
            zIndex: 1,
            pointerEvents: 'none',
            left: features[0].x <= mapWidth / 2 ? features[0].x + 20 : undefined,
            right: features[0].x > mapWidth / 2 ? mapWidth - features[0].x + 20 : undefined,
            top: features[0].y,
            backgroundColor: '#ffffff',
            padding: '1rem',
          }}
        >
          {vessels && vessels.length > 3 && <div className={styles.vesselRow}>Latest vessels</div>}
          {vessels &&
            vessels.slice(0, 3).map((f) => (
              <div key={f.object?.properties?.mmsi} className={styles.vesselRow}>
                <div>
                  <label>MMSI</label>
                  {f.object.properties.mmsi}
                </div>
                <div>
                  <label>TIME</label>
                  {f.object.properties.timestamp
                    ? getTimeAgo(f.object.properties.timestamp * 1000)
                    : '---'}
                </div>
                <div>
                  <label>SPEED</label>
                  {parseInt(f.object.properties.speed)} knots
                </div>
              </div>
            ))}
          {vessels && vessels.length > 3 && (
            <div className={styles.vesselRow}>... + {vessels.length - 3} more</div>
          )}
          {count && `${count / 100} ${count / 100 === 1 ? 'vessel' : 'vessels'}`}
        </div>
      )
    }
  }

  const getCursor = ({ isDragging, isHovering }) => {
    // TODO: check why this is not working
    if (isHovering) return 'pointer'
    return isDragging ? 'grabbing' : 'grab'
  }

  const switchBasemap = () => {
    setCurrentBasemap(
      currentBasemap === BasemapType.Default ? BasemapType.Satellite : BasemapType.Default
    )
  }
  const switchLabels = () => {
    setLabelsShown(!labelsShown)
  }

  return (
    <Fragment>
      <DeckGL
        ref={deckRef}
        views={mapView}
        layers={layers}
        // This avoids performing the default picking
        // since we are handling it through pickMultipleObjects
        // discussion for reference https://github.com/visgl/deck.gl/discussions/5793
        layerFilter={({ renderPass }) => renderPass !== 'picking:hover'}
        getCursor={getCursor}
        controller={true}
        viewState={viewState}
        onClick={onClick}
        onHover={onHover}
        onViewStateChange={onViewStateChange}
        // this experimental prop reduces memory usage
        _typedArrayManagerProps={{ overAlloc: 1, poolSize: 0 }}
      />
      {hoveredFeatures && hoveredFeatures.length > 0 && <InfoTooltip features={hoveredFeatures} />}
      <div className={styles.controls}>
        <MiniGlobe
          size={70}
          center={{ latitude: viewState.latitude, longitude: viewState.longitude }}
          bounds={bounds}
        />
        <Tooltip
          content={
            currentBasemap === BasemapType.Default
              ? 'Switch to satellite basemap'
              : 'Switch to default basemap'
          }
          placement="left"
        >
          <button
            aria-label={
              currentBasemap === BasemapType.Default
                ? 'Switch to satellite basemap'
                : 'Switch to default basemap'
            }
            className={cx(styles.actionButton, styles[currentBasemap])}
            onClick={switchBasemap}
          ></button>
        </Tooltip>
        <button
          aria-label={labelsShown ? 'Hide location labels' : 'Show location labels'}
          className={cx(styles.actionButton, styles.labelsButton)}
          onClick={switchLabels}
        >
          {labelsShown ? 'Hide labels' : 'Show labels'}
        </button>
      </div>
    </Fragment>
  )
}

export default MapWrapper
