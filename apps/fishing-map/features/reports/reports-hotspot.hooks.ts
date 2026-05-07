import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { Feature, MultiPolygon, Polygon } from 'geojson'
import { atom, useAtom, useAtomValue } from 'jotai'

import { selectTimeRange } from 'features/app/selectors/app.timebar.selectors'

import { computeHotspotGeometry } from './reports-hotspot.utils'
import {
  useReportFeaturesLoading,
  useReportFilteredFeatures,
  useReportInstances,
} from './reports-timeseries.hooks'

type HotspotSettings = {
  enabled: boolean
  maxAreaKm2: number
}

export const hotspotSettingsAtom = atom<HotspotSettings>({ enabled: false, maxAreaKm2: 50000 })
export const hotspotGeometryAtom = atom<Feature<Polygon> | null>(null)

// Called once in ReportActivityGraph to drive the computation side-effect
export function useComputeReportHotspot() {
  const settings = useAtomValue(hotspotSettingsAtom)
  const [, setGeometry] = useAtom(hotspotGeometryAtom)
  const filteredFeatures = useReportFilteredFeatures()
  const instanceLayers = useReportInstances()
  const isLoading = useReportFeaturesLoading()
  const { start, end } = useSelector(selectTimeRange)

  // Use a ref to access instanceLayers without including it in effect deps.
  // Adding instanceLayers to deps causes an infinite loop: setGeometry triggers a
  // map re-render which adds the hotspot PolygonsLayer, causing deckLayerInstancesAtom
  // to update and useReportInstances to return a new array ref on every cycle.
  const instanceLayersRef = useRef(instanceLayers)
  instanceLayersRef.current = instanceLayers

  const [, setSettings] = useAtom(hotspotSettingsAtom)

  useEffect(() => {
    return () => {
      setGeometry(null)
      setSettings((prev) => ({ ...prev, enabled: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!settings.enabled || !filteredFeatures || isLoading) {
      setGeometry(null)
      return
    }
    const instances = instanceLayersRef.current.map((l) => l.instance)
    const geometry = computeHotspotGeometry(
      filteredFeatures,
      instances,
      start,
      end,
      settings.maxAreaKm2
    )
    setGeometry(geometry)
  }, [filteredFeatures, start, end, settings.enabled, settings.maxAreaKm2, isLoading, setGeometry])
}

// Used in UI components to read/write hotspot settings
export function useHotspotSettings() {
  const [settings, setSettings] = useAtom(hotspotSettingsAtom)

  const toggle = useCallback(
    (enabled: boolean) => setSettings((prev) => ({ ...prev, enabled })),
    [setSettings]
  )

  const setMaxAreaKm2 = useCallback(
    (maxAreaKm2: number) => setSettings((prev) => ({ ...prev, maxAreaKm2 })),
    [setSettings]
  )

  return {
    enabled: settings.enabled,
    maxAreaKm2: settings.maxAreaKm2,
    toggle,
    setMaxAreaKm2,
  }
}
