import { useEffect } from 'react'
import type { Layer } from '@deck.gl/core'
import { atom, useSetAtom } from 'jotai'
import { selectAtom } from 'jotai/utils'

import type { ChartType, TimebarChartData, TimebarChartsData } from '.'

type ChartState = { data?: TimebarChartData; active?: boolean; layers?: Layer[] }

const chartsStore = atom({} as Partial<Record<ChartType, ChartState>>)

export default chartsStore

const selectActiveCharts = (s: Partial<Record<ChartType, ChartState>>) =>
  Object.fromEntries(Object.entries(s).filter(([, v]) => v?.active)) as TimebarChartsData

const activeChartsEqual = (a: TimebarChartsData, b: TimebarChartsData) => {
  const ak = Object.keys(a)
  if (ak.length !== Object.keys(b).length) return false
  return ak.every((k) => a[k as ChartType]?.data === b[k as ChartType]?.data)
}

export const activeChartsDataState = selectAtom(chartsStore, selectActiveCharts, activeChartsEqual)

const LAYER_ORDER: ChartType[] = ['tracksGraphs', 'activity', 'tracks', 'tracksEvents']

const selectLayers = (s: Partial<Record<ChartType, ChartState>>) =>
  LAYER_ORDER.flatMap((key) => s[key]?.layers ?? [])

const layersEqual = (a: Layer[], b: Layer[]) =>
  a.length === b.length && a.every((layer, i) => layer === b[i])

export const activeChartLayersState = selectAtom(chartsStore, selectLayers, layersEqual)

export const useUpdateChartsData = (key: ChartType, data: TimebarChartData) => {
  const setChartsData = useSetAtom(chartsStore)

  // Keep this chart's data current (one atom write per data change; stays active while mounted).
  useEffect(() => {
    setChartsData((prev) => ({ ...prev, [key]: { ...prev[key], data, active: true } }))
  }, [key, data, setChartsData])

  // Flag inactive on unmount so the highlighter ignores it (keeps the last data).
  useEffect(() => {
    return () => {
      setChartsData((prev) => ({ ...prev, [key]: { ...prev[key], active: false } }))
    }
  }, [key, setChartsData])
}

export const useUpdateChartLayers = (key: ChartType, layers: Layer[]) => {
  const setChartsData = useSetAtom(chartsStore)

  useEffect(() => {
    setChartsData((prev) => ({ ...prev, [key]: { ...prev[key], layers } }))
  }, [key, layers, setChartsData])

  useEffect(() => {
    return () => {
      setChartsData((prev) =>
        prev[key]?.layers ? { ...prev, [key]: { ...prev[key], layers: undefined } } : prev
      )
    }
  }, [key, setChartsData])
}

export const hoveredEventState = atom(undefined as string | undefined)
