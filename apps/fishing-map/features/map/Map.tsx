import { Fragment, lazy, Suspense, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import type { InteractionEvent } from '@globalfishingwatch/deck-layer-composer'
import {
  useSetDeckLayerComposer,
  useSetMapHoverInteraction,
} from '@globalfishingwatch/deck-layer-composer'
import { Logo } from '@globalfishingwatch/ui-components'

import { ROOT_DOM_ELEMENT } from 'data/config'
import MapControls from 'features/map/controls/MapControls'
import { selectScreenshotAreaId } from 'features/map/controls/screenshot.slice'
import ErrorNotificationDialog from 'features/map/overlays/error-notification/ErrorNotification'
import MapPopups from 'features/map/popups/MapPopups'
import { selectScreenshotModalOpen } from 'features/modals/modals.slice'
import {
  selectIsAnyReportLocation,
  selectIsAnyVesselLocation,
  selectIsWorkspaceLocation,
} from 'router/routes.selectors'
import { AsyncReducerStatus } from 'utils/async-slice'

import MapInfo from './controls/MapInfo'
import MapAnnotationsDialog from './overlays/annotations/AnnotationsDialog'
import { CoordinateEditOverlay } from './overlays/draw/CoordinateEditOverlay'
import LayersComposer from './LayersComposer'
import { useMapDrawConnect } from './map-draw.hooks'
import { MAP_CONTAINER_ID, useUpdateViewStateUrlParams } from './map-viewport.hooks'
import TimeComparisonLegend from './TimeComparisonLegend'

import styles from './Map.module.css'

const DrawDialog = lazy(() => import('./overlays/draw/DrawDialog'))
const Hint = lazy(() => import('features/help/Hint'))
const DeckGLWrapper = lazy(() => import('./DeckGLWrapper'))

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

  const isAnyReportLocation = useSelector(selectIsAnyReportLocation)
  const isWorkspaceLocation = useSelector(selectIsWorkspaceLocation)
  const isVesselLocation = useSelector(selectIsAnyVesselLocation)
  const isPrinting = useSelector(selectScreenshotModalOpen)
  const screenshotAreaId = useSelector(selectScreenshotAreaId)

  return (
    <div
      id={MAP_CONTAINER_ID}
      data-testid={MAP_CONTAINER_ID}
      className={styles.container}
      onMouseLeave={onMouseLeave}
    >
      {isPrinting && screenshotAreaId !== ROOT_DOM_ELEMENT && (
        <Logo className={styles.logo} type="invert" />
      )}
      <Suspense fallback={null}>
        <Suspense fallback={null}>
          <LayersComposer />
        </Suspense>
        <DeckGLWrapper />
      </Suspense>
      {isMapDrawing && (
        <Fragment>
          <CoordinateEditOverlay />
          <Suspense fallback={null}>
            <DrawDialog />
          </Suspense>
        </Fragment>
      )}
      <MapPopups />
      <ErrorNotificationDialog />
      <MapAnnotationsDialog />
      <MapControls />
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Suspense fallback={null}>
          <Hint id="fishingEffortHeatmap" className={styles.helpHintLeft} />
        </Suspense>
      )}
      {isWorkspaceLocation && !isAnyReportLocation && (
        <Suspense fallback={null}>
          <Hint id="clickingOnAGridCellToShowVessels" className={styles.helpHintRight} />
        </Suspense>
      )}
      {(isWorkspaceLocation || isVesselLocation || isAnyReportLocation) && <MapInfo />}

      <TimeComparisonLegend />
    </div>
  )
}

export default MapWrapper
