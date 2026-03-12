import { useDispatch, useSelector } from 'react-redux'

import { selectPortPointsByCountry } from 'features/labeler/labeler.selectors'
import {
  selectCountry,
  selectPointValues,
  selectPorts,
  selectPortValues,
  selectSubareas,
  selectSubareaValues,
  setSelectedPoints,
} from 'features/labeler/labeler.slice'
import { useMapConnect } from 'features/map/map.hooks'
import type { PortPosition, PortSubarea } from 'types'

type Dictionary<T> = Record<string, T>

export const useSearchConnect = () => {
  const dispatch = useDispatch()
  const portValues = useSelector(selectPortValues)
  const pointValues = useSelector(selectPointValues)
  const subareaValues = useSelector(selectSubareaValues)
  const subareas = useSelector(selectSubareas)
  const ports = useSelector(selectPorts)
  const { centerPoints } = useMapConnect()
  const records = useSelector(selectPortPointsByCountry)
  const country = useSelector(selectCountry)

  const compareProperty = (term: string, fields: string[]): boolean => {
    return fields.some(
      (field) => field && field.toLocaleLowerCase().includes(term.toLocaleLowerCase())
    )
  }

  const filterFiels = (
    records: PortPosition[],
    country: string | null,
    term: string,
    fieldValues: Dictionary<Dictionary<string>>,
    optionNames: Dictionary<string> | null,
    mainSearchProperties: string[]
  ): PortPosition[] => {
    if (country) {
      return records.filter((record: PortPosition) => {
        const recordValue = fieldValues[country]?.[record.s2id] ?? ''
        const optionName = optionNames?.[recordValue]
        return compareProperty(term, [
          recordValue,
          ...(optionName ? [optionName] : []),
        ])
      })
    } else {
      return records.filter((record: PortPosition) => {
        return compareProperty(
          term,
          mainSearchProperties.map((property) => String(record[property as keyof PortPosition] ?? ''))
        )
      })
    }
  }

  const searchPoints = (type: string, term: string) => {
    let filteredPoints: PortPosition[] = []
    const optionNames: Dictionary<string> = {}
    if (type === 'destination') {
      filteredPoints = records.filter((record: PortPosition) => {
        return compareProperty(term, [record.top_destination])
      })
    }
    if (type === 'port') {
      if (country) {
        ports[country]?.forEach((port: PortSubarea) => {
          optionNames[port.id] = port.name
        })
      }
      filteredPoints = filterFiels(records, country, term, portValues, optionNames, [
        'port_label',
        'port_iso3',
      ])
    }
    if (type === 'subarea') {
      if (country) {
        subareas[country]?.forEach((subarea: PortSubarea) => {
          optionNames[subarea.id] = subarea.name
        })
      }
      filteredPoints = filterFiels(records, country, term, subareaValues, optionNames, [
        'community_label',
        'community_iso3',
      ])
    }
    if (type === 'anchorage') {
      filteredPoints = filterFiels(records, country, term, pointValues, null, ['point_label'])
    }

    if (filteredPoints) {
      centerPoints(filteredPoints)
      dispatch(setSelectedPoints(filteredPoints.map((point: PortPosition) => point.s2id)))
    } else {
      dispatch(setSelectedPoints([]))
    }
  }

  return {
    searchPoints,
  }
}
