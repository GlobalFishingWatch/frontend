import { useDispatch, useSelector } from 'react-redux'
import {
  selectMapData,
  selectPointValues,
  selectPortValues,
  selectSubareas,
  selectSubareaValues,
  setCountry,
  setData,
  setPointValues,
  setPorts,
  setPortValues,
  setSubareas,
  setSubareaValues
} from 'features/labeler/labeler.slice'
import { PortPosition } from 'types'
import { getFixedColorForUnknownLabel } from 'utils/colors'
import { useMapConnect } from 'features/map/map.hooks'

export const useSelectedTracksConnect = () => {
  const dispatch = useDispatch()
  const allRecords = useSelector(selectMapData)
  const portValues = useSelector(selectPortValues)
  const pointValues = useSelector(selectPointValues)
  const subareaValues = useSelector(selectSubareaValues)
  const subareas = useSelector(selectSubareas)
  const { centerPoints } = useMapConnect()
  let fileReader: FileReader

  const assignLabeledValues = (points: PortPosition[]) => {

    const mapSubareas = subareas.reduce((result, subarea) => {
      result[subarea.id] = subarea.name

      return result
    }, {})
    return points.map(point => {
      const ciso3 = subareaValues[point.iso3] ? subareaValues[point.iso3][point.s2id] : point.community_iso3
      const pointValue = pointValues[point.iso3] ? pointValues[point.iso3][point.s2id] : point.point_label
      return {
        ...point,
        label: portValues[point.s2id],
        community_iso3: ciso3,
        sublabel: mapSubareas[ciso3],
        point_label: pointValue ?? null
      }
    })
  }
  // Prepare the selected track to be downloaded
  const dispatchDownloadSelectedTracks = () => {
    const data = assignLabeledValues(allRecords)
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(data)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = 'exported_data.json'
    document.body.appendChild(element) // Required for this to work in FireFox
    element.click()
  }

  /**
   * handle the file after this was uploaded
   */
  const handleFileUploaded = (e: any) => {
    const content: string = fileReader.result as string
    const records: any = JSON.parse(content)

    dispatch(setData(records.map(record => ({
      ...record,
      lat: typeof record.lat === 'string' ? parseFloat(record.lat) : record.lat,
      lon: typeof record.lon === 'string' ? parseFloat(record.lon) : record.lon
    }))))
  }

  /**
   * This function is fired when the file is selected
   * @param event
   */
  const dispatchImportHandler = (event: any) => {
    if (event.target.files && event.target.files.length) {
      fileReader = new FileReader()
      fileReader.onloadend = handleFileUploaded
      fileReader.readAsText(event.target.files[0])
    }
  }

  const onCountryChange = (country: string) => {
    dispatch(setCountry(country))

    const tempPorts = []
    const tempSubareas = []
    const countryRecords = allRecords?.filter((point) => point.iso3 === country) || []
    centerPoints(countryRecords)
    countryRecords.forEach(e => {
      tempPorts.push(e.label)
      tempSubareas.push(e.community_iso3)
    })
    const uniqueTempPorts = [...new Set(tempPorts)];
    const uniqueTempSubareas = [...new Set(tempSubareas)];

    dispatch(setSubareas(uniqueTempSubareas.map((e, index) => {
      const record = countryRecords.find(record => record.community_iso3 === e)
      return {
        id: e,
        name: record.sublabel ?? record.community_iso3,
        color: getFixedColorForUnknownLabel(index)
      }
    })))
    dispatch(setPorts(uniqueTempPorts))
    const portMap = countryRecords.reduce((ac, value, i, v) => {
      ac[value.s2id] = value.label
      return ac
    }, {})
    dispatch(setPortValues(portMap))
    const subareaMap = countryRecords.reduce((ac, value, i, v) => {
      ac[value.s2id] = value.community_iso3
      return ac
    }, {})
    dispatch(setSubareaValues(subareaMap))
    const pointMap = countryRecords.reduce((ac, value, i, v) => {
      ac[value.s2id] = value.point_label
      return ac
    }, {})
    dispatch(setPointValues(pointMap))

  }

  return {
    dispatchDownloadSelectedTracks,
    dispatchImportHandler,
    onCountryChange
  }
}
