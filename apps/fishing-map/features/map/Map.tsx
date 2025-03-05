import { Fragment, useCallback, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import dynamic from 'next/dynamic'

// import { atom, useAtom } from 'jotai'
import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import {
  useIsDeckLayersLoading,
  useSetDeckLayerComposer,
  useSetMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'

import { selectHasDeprecatedDataviewInstances } from 'features/dataviews/selectors/dataviews.instances.selectors'
// import { useClickedEventConnect, useGeneratorsConnect } from 'features/map/map.hooks'
import MapControls from 'features/map/controls/MapControls'
import DeckGLWrapper from 'features/map/DeckGLWrapper'
import ErrorNotificationDialog from 'features/map/overlays/error-notification/ErrorNotification'
import MapPopups from 'features/map/popups/MapPopups'
import { selectReportAreaStatus } from 'features/reports/report-area/area-reports.selectors'
import {
  selectIsAnyAreaReportLocation,
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsWorkspaceLocation,
} from 'routes/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import MapInfo from './controls/MapInfo'
import MapAnnotationsDialog from './overlays/annotations/AnnotationsDialog'
import { CoordinateEditOverlay } from './overlays/draw/CoordinateEditOverlay'
import { useMapDrawConnect } from './map-draw.hooks'
import { MAP_CONTAINER_ID, useUpdateViewStateUrlParams } from './map-viewport.hooks'
import TimeComparisonLegend from './TimeComparisonLegend'

import styles from './Map.module.css'

const DrawDialog = dynamic(
  () => import(/* webpackChunkName: "DrawDialog" */ './overlays/draw/DrawDialog')
)
const Hint = dynamic(() => import(/* webpackChunkName: "Hint" */ 'features/help/Hint'))

const MapWrapper = () => {
  useUpdateViewStateUrlParams()
  const { isMapDrawing } = useMapDrawConnect()

  const setMapHoverFeatures = useSetMapHoverInteraction()
  const onMouseLeave = useCallback(() => {
    setMapHoverFeatures({} as InteractionEvent)
  }, [setMapHoverFeatures])

  const setDeckLayers = useSetDeckLayerComposer()
  useEffect(() => {
    return () => {
      setDeckLayers([])
    }
  }, [setDeckLayers])

  const isAreaReportLocation = useSelector(selectIsAnyAreaReportLocation)
  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)

  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const reportAreaStatus = useSelector(selectReportAreaStatus)
  const hasDeprecatedDataviewInstances = useSelector(selectHasDeprecatedDataviewInstances)

  const mapLoading = useIsDeckLayersLoading()
  const isReportAreaLoading = useMemo(
    () => isAreaReportLocation && reportAreaStatus === AsyncReducerStatus.Loading,
    [isAreaReportLocation, reportAreaStatus]
  )

  return (
    <div
      id={MAP_CONTAINER_ID}
      className={styles.container}
      onMouseLeave={onMouseLeave}
      style={hasDeprecatedDataviewInstances ? { pointerEvents: 'none' } : {}}
    >
      <DeckGLWrapper />
      {isMapDrawing && (
        <Fragment>
          <CoordinateEditOverlay />
          <DrawDialog />
        </Fragment>
      )}
      <MapPopups />
      <ErrorNotificationDialog />
      <MapAnnotationsDialog />
      <MapControls mapLoading={mapLoading || isReportAreaLoading} />
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
      )}
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
      )}
      {(isWorkspaceLocation || isVesselLocation || isAnyReportLocation) && <MapInfo />}

      <TimeComparisonLegend />
    </div>
  )
}

export default MapWrapper
