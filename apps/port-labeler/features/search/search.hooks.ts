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
    records,
    country: string | null,
    term: string,
    fieldValues,
    optionNames: Dictionary<string> | null,
    mainSearchProperties: string[]
  ) => {
    if (country) {
      return records.filter((record) => {
        return compareProperty(term, [
          fieldValues[country][record.s2id],
          ...(optionNames ? optionNames[fieldValues[country][record.s2id]] : []),
        ])
      })
    } else {
      return records.filter((record) => {
        return compareProperty(
          term,
          mainSearchProperties.map((property) => record[property])
        )
      })
    }
  }

  const searchPoints = (type: string, term: string) => {
    let filteredPoints = []
    const optionNames = {}
    if (type === 'destination') {
      filteredPoints = records.filter((record) => {
        return compareProperty(term, [record.top_destination])
      })
    }
    if (type === 'port') {
      if (country) {
        ports[country].forEach((port) => {
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
        subareas[country].forEach((subarea) => {
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
      dispatch(setSelectedPoints(filteredPoints.map((point) => point.s2id)))
    } else {
      dispatch(setSelectedPoints([]))
    }
  }

  return {
    searchPoints,
  }
}
