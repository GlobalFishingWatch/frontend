import { useDispatch, useSelector } from 'react-redux'
import { selectUserData } from 'features/user/user.slice'
import { selectMapData, selectPortValues, selectSubareas, selectSubareaValues, setData } from 'features/labeler/labeler.slice'
import { PortPosition } from 'types'

export const useSelectedTracksConnect = () => {
  const dispatch = useDispatch()
  const records = useSelector(selectMapData)
  const portValues = useSelector(selectPortValues)
  const subareaValues = useSelector(selectSubareaValues)
  const subareas = useSelector(selectSubareas)
  const user = useSelector(selectUserData)
  let fileReader: FileReader

  const assignLabeledValues = (points: PortPosition[]) => {
    const mapSubareas = subareas.reduce((result, subarea) => {
      result[subarea.id] = subarea.name

      return result
    }, {})
    return points.map(point => {
      const ciso3 = subareaValues[point.s2id]
      return {
        ...point,
        label: portValues[point.s2id],
        community_iso3: ciso3,
        sublabel: mapSubareas[ciso3]
      }
    })
  }
  // Prepare the selected track to be downloaded
  const dispatchDownloadSelectedTracks = () => {
    const data = assignLabeledValues(records)
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

  return {
    dispatchDownloadSelectedTracks,
    dispatchImportHandler,
  }
}
