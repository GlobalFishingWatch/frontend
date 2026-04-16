import { useEffect, useState } from 'react'

import { PATH_BASENAME } from 'data/config'

import type { MigramarRow } from '../../../../../pages/api/migramar/[areaId]'
import type { MigramarIndicator, MigramarSpecies } from '../../../../../pages/api/migramar/options'

export function useMigramarOptions() {
  const [species, setSpecies] = useState<MigramarSpecies[]>([])
  const [indicators, setIndicators] = useState<MigramarIndicator[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${PATH_BASENAME}/api/migramar/options`)
      .then((res) => res.json())
      .then((data) => {
        setSpecies(data.species || [])
        setIndicators(data.indicators || [])
      })
      .finally(() => setLoading(false))
  }, [])

  return { species, indicators, loading }
}

export function useMigramarAreaData(areaId: string) {
  const [rows, setRows] = useState<MigramarRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${PATH_BASENAME}/api/migramar/${areaId}`)
      .then((res) => res.json())
      .then((data) => setRows(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }, [areaId])

  return { rows, loading }
}
