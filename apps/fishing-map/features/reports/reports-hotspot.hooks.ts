import { useCallback, useEffect, useRef } from 'react'
import type { Feature, Polygon } from 'geojson'
import { atom, useAtom } from 'jotai'

import { useAppDispatch, useAppSelector } from 'features/app/app.hooks'
import {
  selectReportHotspotSettings,
  setReportHotspotSettings,
} from 'features/reports/tabs/activity/reports-activity.slice'
import type { BufferUnit } from 'types'

import { computeHotspotGeometry } from './reports-hotspot.utils'
import {
  useReportFeaturesLoading,
  useReportFilteredFeatures,
  useReportInstances,
} from './reports-timeseries.hooks'

export const hotspotGeometryAtom = atom<Feature<Polygon> | null>(null)

// Called once in ReportActivityGraph to drive the computation side-effect
export function useComputeReportHotspot() {
  const { enabled, area, unit } = useAppSelector(selectReportHotspotSettings)
  const [, setGeometry] = useAtom(hotspotGeometryAtom)
  const filteredFeatures = useReportFilteredFeatures()
  const instanceLayers = useReportInstances()
  const isLoading = useReportFeaturesLoading()

  const instanceLayersRef = useRef(instanceLayers)
  useEffect(() => {
    instanceLayersRef.current = instanceLayers
  })

  useEffect(() => {
    return () => {
      setGeometry(null)
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
  const settings = useAppSelector(selectReportHotspotSettings)
  const dispatch = useAppDispatch()

  const toggle = useCallback(
    (enabled: boolean) => dispatch(setReportHotspotSettings({ enabled })),
    [dispatch]
  )

  const setArea = useCallback(
    (area: number) => dispatch(setReportHotspotSettings({ area })),
    [dispatch]
  )

  const setUnit = useCallback(
    (unit: BufferUnit) => dispatch(setReportHotspotSettings({ unit })),
    [dispatch]
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
