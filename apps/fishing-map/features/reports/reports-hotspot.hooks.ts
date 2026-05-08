import { useCallback, useEffect, useRef } from 'react'
import type { Feature, Polygon } from 'geojson'
import { atom, useAtom, useAtomValue } from 'jotai'

import { KILOMETERS } from 'features/reports/report-area/area-reports.config'
import type { BufferUnit } from 'types'

import { computeHotspotGeometry } from './reports-hotspot.utils'
import {
  useReportFeaturesLoading,
  useReportFilteredFeatures,
  useReportInstances,
} from './reports-timeseries.hooks'

type HotspotSettings = {
  enabled: boolean
  area: number
  unit: BufferUnit
}

export const hotspotSettingsAtom = atom<HotspotSettings>({
  enabled: false,
  area: 50000,
  unit: KILOMETERS,
})
export const hotspotGeometryAtom = atom<Feature<Polygon> | null>(null)

// Called once in ReportActivityGraph to drive the computation side-effect
export function useComputeReportHotspot() {
  const { enabled, area, unit } = useAtomValue(hotspotSettingsAtom)
  const [, setGeometry] = useAtom(hotspotGeometryAtom)
  const filteredFeatures = useReportFilteredFeatures()
  const instanceLayers = useReportInstances()
  const isLoading = useReportFeaturesLoading()

  const instanceLayersRef = useRef(instanceLayers)
  useEffect(() => {
    instanceLayersRef.current = instanceLayers
  })

  const [, setSettings] = useAtom(hotspotSettingsAtom)

  useEffect(() => {
    return () => {
      setGeometry(null)
      setSettings((prev) => ({ ...prev, enabled: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!enabled || !filteredFeatures || isLoading) {
      setGeometry(null)
      return
    }
    const instances = instanceLayersRef.current.map((l) => l.instance)
    const geometry = computeHotspotGeometry(filteredFeatures, instances, area, unit)
    setGeometry(geometry)
  }, [filteredFeatures, enabled, area, unit, isLoading, setGeometry])
}

// Used in UI components to read/write hotspot settings
export function useHotspotSettings() {
  const [settings, setSettings] = useAtom(hotspotSettingsAtom)

  const toggle = useCallback(
    (enabled: boolean) => setSettings((prev) => ({ ...prev, enabled })),
    [setSettings]
  )

  const setArea = useCallback(
    (area: number) => setSettings((prev) => ({ ...prev, area })),
    [setSettings]
  )

  const setUnit = useCallback(
    (unit: BufferUnit) => setSettings((prev) => ({ ...prev, unit })),
    [setSettings]
  )

  return {
    enabled: settings.enabled,
    area: settings.area,
    unit: settings.unit,
    toggle,
    setArea,
    setUnit,
  }
}
