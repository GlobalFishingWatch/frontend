import { useDispatch, useSelector } from 'react-redux'
import { flags } from '@globalfishingwatch/i18n-labels'
import {
  selectMapData,
  selectPointValues,
  selectPorts,
  selectPortValues,
  selectSubareas,
  selectSubareaValues,
  setCountry,
  setData,
  setPointValues,
  setPorts,
  setPortValues,
  setSubareas,
  setSubareaValues,
  setCountriesMetadata,
  selectCountry,
  setSelectedPoints
} from 'features/labeler/labeler.slice'
import { PortPosition } from 'types'
import { getFixedColorForUnknownLabel } from 'utils/colors'
import { useMapConnect } from 'features/map/map.hooks'
import { selectFilteredPoints, selectPortPointsByCountry } from 'features/labeler/labeler.selectors'

export const useSearchConnect = () => {
  const dispatch = useDispatch()
  const allRecords = useSelector(selectMapData)
  const portValues = useSelector(selectPortValues)
  const pointValues = useSelector(selectPointValues)
  const subareaValues = useSelector(selectSubareaValues)
  const subareas = useSelector(selectSubareas)
  const ports = useSelector(selectPorts)
  const { centerPoints } = useMapConnect()
  const records = useSelector(selectPortPointsByCountry)
  const country = useSelector(selectCountry)

  const compareProperty = (term: string, fields: string[]): boolean => {
    return fields.some(field => field && field.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
  }

  const searchPoints = (type: string, term: string) => {
    let filteredPoints = []
    const optionNames = []
    if (type === 'destination') {
      filteredPoints = records.filter(record => {
        return compareProperty(term, [record.top_destination])
      })
    }
    if (type === 'port' && country) {
      ports[country].forEach((port) => {
        optionNames[port.id] = port.name
      });
      filteredPoints = records.filter(record => {
        return compareProperty(term, [portValues[country][record.s2id], optionNames[portValues[country][record.s2id]]])
      })
    } else if (type === 'port') {
      filteredPoints = records.filter(record => {
        return compareProperty(term, [record.port_label])
      })
    }
    if (filteredPoints) {
      centerPoints(filteredPoints)
      dispatch(setSelectedPoints(filteredPoints.map((point) => point.s2id)))
    } else {
      dispatch(setSelectedPoints([]))
    }

  }


  return {
    searchPoints
  }
}
