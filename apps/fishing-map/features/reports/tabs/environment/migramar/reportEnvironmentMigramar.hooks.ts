import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { SelectOption } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import type { MigramarRow } from 'routes/api/migramar/$areaId'
import type { MigramarIndicator, MigramarSpecies } from 'routes/api/migramar/options'

export const YEAR_REGEX = /^\d{4}$/

function hasYearData(row: MigramarRow): boolean {
  return Object.keys(row).some(
    (key) =>
      YEAR_REGEX.test(key) &&
      (row as Record<string, string>)[key] != null &&
      (row as Record<string, string>)[key] !== ''
  )
}

export function useMigramar(areaId?: string) {
  const { i18n } = useTranslation()

  const [species, setSpecies] = useState<MigramarSpecies[]>([])
  const [indicators, setIndicators] = useState<MigramarIndicator[]>([])
  const [optionsLoading, setOptionsLoading] = useState(true)

  const [rows, setRows] = useState<MigramarRow[]>([])
  const [dataLoading, setDataLoading] = useState(!!areaId)

  const [selectedSpecies, setSelectedSpecies] = useState<SelectOption | undefined>()
  const [selectedIndicator, setSelectedIndicator] = useState<SelectOption | undefined>()

  useEffect(() => {
    fetch(`${PATH_BASENAME}/api/migramar/options`)
      .then((res) => res.json())
      .then((data) => {
        setSpecies(data.species || [])
        setIndicators(data.indicators || [])
      })
      .finally(() => setOptionsLoading(false))
  }, [])

  useEffect(() => {
    if (!areaId) return
    fetch(`${PATH_BASENAME}/api/migramar/${areaId}`)
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .finally(() => setDataLoading(false))
  }, [areaId])

  const speciesOptions: SelectOption[] = useMemo(
    () =>
      species
        .filter((s) => rows.some((r) => r.species === s.id && hasYearData(r)))
        .map((s) => ({ id: s.id, label: i18n.language === 'es' ? s.label_es : s.label_en })),
    [species, rows, i18n.language]
  )

  const effectiveSpecies = useMemo(
    () =>
      selectedSpecies && speciesOptions.some((s) => s.id === selectedSpecies.id)
        ? selectedSpecies
        : speciesOptions[0],
    [selectedSpecies, speciesOptions]
  )

  const indicatorOptions: SelectOption[] = useMemo(
    () =>
      indicators
        .filter((ind) =>
          rows.some(
            (r) =>
              r.indicator === ind.id &&
              (effectiveSpecies ? r.species === effectiveSpecies.id : true) &&
              hasYearData(r)
          )
        )
        .map((ind) => ({
          id: ind.id,
          label: i18n.language === 'es' ? ind.label_es_long : ind.label_en_long,
        })),
    [indicators, rows, i18n.language, effectiveSpecies]
  )

  const effectiveIndicator = useMemo(
    () =>
      selectedIndicator && indicatorOptions.some((i) => i.id === selectedIndicator.id)
        ? selectedIndicator
        : indicatorOptions[0],
    [selectedIndicator, indicatorOptions]
  )

  const graphData = useMemo(
    () =>
      effectiveSpecies && effectiveIndicator
        ? rows.find(
            (row) => row.species === effectiveSpecies.id && row.indicator === effectiveIndicator.id
          )
        : undefined,
    [rows, effectiveSpecies, effectiveIndicator]
  )

  const selectSpecies = (option: SelectOption) => {
    setSelectedSpecies(option)
    setSelectedIndicator(undefined)
  }

  return {
    speciesOptions,
    indicatorOptions,
    effectiveSpecies,
    effectiveIndicator,
    selectSpecies,
    selectIndicator: setSelectedIndicator,
    graphData,
    loading: optionsLoading || dataLoading,
  }
}
