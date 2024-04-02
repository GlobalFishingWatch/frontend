import { tableFromIPC, Table, Schema } from 'apache-arrow'
import { readParquet } from 'parquet-wasm'
import { VesselTrackData } from './types'

const getSchemaFieldIndex = (schema: Schema, fieldName: string) => {
  return schema.fields.findIndex((f) => f.name === fieldName)
}

const getTableColumn = (arrowTable: Table, fieldName: string) => {
  return arrowTable.getChildAt(getSchemaFieldIndex(arrowTable.schema, fieldName))
}

export const parseTrack = async (parquetBuffer: ArrayBuffer): Promise<VesselTrackData> => {
  const data: VesselTrackData = {
    // Number of geometries
    length: 0,
    // Indices into positions where each path starts
    startIndices: [] as number[],
    // Flat coordinates array
    attributes: {
      getPath: { value: new Float32Array(), size: 2 },
      getTimestamps: { value: new Float32Array(), size: 1 },
    },
  }
  try {
    const parquetBytes = new Uint8Array(parquetBuffer)
    const decodedArrowBytes = readParquet(parquetBytes)
    const arrowTable = tableFromIPC(decodedArrowBytes)
    const latColumn = getTableColumn(arrowTable, 'lat')
    const lonColumn = getTableColumn(arrowTable, 'lon')
    const segColumn = getTableColumn(arrowTable, 'seg_id')
    const timestampColumn = getTableColumn(arrowTable, 'timestamp')

    if (!latColumn || !lonColumn || !segColumn || !timestampColumn) {
      return data
    }

    let index = 0
    let currentSegId = ''
    const segmentIndexes = [] as number[]
    const dataLength = lonColumn.data.reduce((acc, data) => data.length + acc, 0)
    const positions = new Float32Array(dataLength * data.attributes.getPath.size)
    const timestamps = new Float32Array(dataLength)

    lonColumn.data.forEach((eachData) => {
      eachData.values.forEach((lon: number) => {
        if (currentSegId !== segColumn.get(index)) {
          segmentIndexes.push(index * data.attributes.getPath.size)
          currentSegId = segColumn.get(index)
        }
        positions[data.attributes.getPath.size * index] = lon
        positions[data.attributes.getPath.size * index + 1] = latColumn.get(index)
        timestamps[index] = Number(timestampColumn?.get(index))
        index++
      })
    })
    data.length = segmentIndexes.length
    data.startIndices = segmentIndexes
    data.attributes.getPath.value = positions
    data.attributes.getTimestamps.value = timestamps

    return data
  } catch (e) {
    console.log('Error parsing track:', e)
    return data
  }
}
