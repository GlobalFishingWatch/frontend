import { typedKeys } from 'utils/shared'
import { VesselAPISource, VesselWithHistory } from 'types'

type VesselFieldKey = keyof VesselWithHistory

const getFieldPriority = (field: VesselFieldKey): VesselAPISource[] => {
  console.log(field as string)
  return [VesselAPISource.TMT, VesselAPISource.GFW]
}

const getPriorityzedFieldValue = (
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: any }[]
): any[] => {
  const fieldPriority = getFieldPriority(field)
  return dataValues
    .filter(({ value }) => value !== null && value !== undefined)
    .map((dataValue) => ({
      ...dataValue,
      priority: fieldPriority.indexOf(dataValue.source),
    }))
    .sort((a, b) => (a.priority < b.priority ? 1 : -1))
    .map(({ value }) => value)
}

const priorityzeFieldValue = (
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: any }[]
): string => {
  return getPriorityzedFieldValue(field, dataValues).slice(0, 1).join('')
}

const mergeHistoryFields = (
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: any }[]
): string => {
  return getPriorityzedFieldValue(field, dataValues)
    .reduce(
      (acc, current) => ({
        byCount: acc.byCount.concat(current.byCount),
        byDate: acc.byDate.concat(current.byDate),
      }),
      { byCount: [], byDate: [] }
    )
    .join('')
}

const mergeFieldThunk = (field: VesselFieldKey) => {
  if (field.toString() === 'history') {
    return mergeHistoryFields
  }
  return priorityzeFieldValue
}

export const mergeVesselFromSources = (
  vesselData: {
    source: VesselAPISource
    vessel: VesselWithHistory
  }[]
): VesselWithHistory => {
  const vessel = vesselData.slice().shift()?.vessel
  if (vessel) {
    return typedKeys<VesselWithHistory>(vessel).reduce((acc, key) => {
      const mergeField = mergeFieldThunk(key)
      const value = mergeField(
        key,
        vesselData.map((data) => ({ source: data.source, value: data.vessel[key] }))
      )

      return {
        ...acc,
        [key]: value,
      }
    }, {}) as VesselWithHistory
  } else {
    throw new Error('No vessel data to merge')
  }
}
