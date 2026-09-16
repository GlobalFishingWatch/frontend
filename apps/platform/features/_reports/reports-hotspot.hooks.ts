import { useCallback, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import type { Feature, Polygon } from 'geojson'
import { atom, useAtom } from 'jotai'

import { DEFAULT_HOTSPOT_AREA, DEFAULT_HOTSPOT_UNIT } from 'features/_reports/reports.config'
import {
  selectReportHotspotArea,
  selectReportHotspotUnit,
} from 'features/_reports/reports.config.selectors'
import { useReplaceQueryParams } from 'router/routes.hook'
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
  const { enabled, area, unit } = useHotspotSettings()
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

/**
 * Hotspot settings live in the url, like the report buffer, so the ellipse is redrawn on load and
 * a clicked hotspot popup can be re-picked from the shared coordinates.
 */
export function useHotspotSettings() {
  const urlArea = useSelector(selectReportHotspotArea) as number | undefined
  const unit = (useSelector(selectReportHotspotUnit) as BufferUnit) || DEFAULT_HOTSPOT_UNIT
  const { replaceQueryParams } = useReplaceQueryParams()

  const toggle = useCallback(
    (enabled: boolean) =>
      replaceQueryParams({
        reportHotspotArea: enabled ? urlArea || DEFAULT_HOTSPOT_AREA : undefined,
        reportHotspotUnit: enabled ? unit : undefined,
      }),
    [replaceQueryParams, urlArea, unit]
  )

  const setArea = useCallback(
    (area: number) => replaceQueryParams({ reportHotspotArea: area, reportHotspotUnit: unit }),
    [replaceQueryParams, unit]
  )

  const setUnit = useCallback(
    (unit: BufferUnit) => replaceQueryParams({ reportHotspotUnit: unit }),
    [replaceQueryParams]
  )

  return {
    enabled: urlArea !== undefined,
    area: urlArea ?? DEFAULT_HOTSPOT_AREA,
    unit,
    toggle,
    setArea,
    setUnit,
  }
}
