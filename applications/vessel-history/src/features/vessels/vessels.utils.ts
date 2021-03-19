import { typedKeys } from 'utils/shared'
import { VesselAPISource, VesselFieldsHistory, VesselWithHistory } from 'types'

type VesselFieldKey = keyof VesselWithHistory

export const formatVesselProfileId = (dataset: string, gfwId: string, tmtId: string) => {
  return `${dataset}_${gfwId}_${tmtId}`
}
const getFieldPriority = (field: VesselFieldKey): VesselAPISource[] => {
  return [VesselAPISource.TMT, VesselAPISource.GFW]
}

const getPriorityzedFieldValue = <T = any>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
): T[] => {
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

const priorityzeFieldValue = <T>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
) => {
  return getPriorityzedFieldValue(field, dataValues).slice(0, 1).shift() as T
}

const mergeHistoryFields = (
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: VesselFieldsHistory }[]
) => {
  const fieldValues = getPriorityzedFieldValue<VesselFieldsHistory>(field, dataValues)
  return (fieldValues || []).reduce(
    (acc, current) =>
      typedKeys<VesselFieldsHistory>(current as VesselFieldsHistory).reduce(
        (history, field) => ({
          ...history,
          [field]: {
            byCount: (acc[field]?.byCount || []).concat(current[field].byCount),
            byDate: (acc[field]?.byDate || []).concat(current[field].byDate),
          },
        }),
        { ...acc }
      ),
    {} as VesselFieldsHistory
  )
}

export const mergeVesselFromSources = (
  vesselData: {
    source: VesselAPISource
    vessel: VesselWithHistory
  }[]
): VesselWithHistory => {
  const allFields = Array.from(
    new Set(vesselData.map((v) => typedKeys<VesselWithHistory>(v.vessel)).flat())
  )
  if (allFields.length) {
    const result = allFields.reduce((acc, key) => {
      const value =
        key.toString() === 'history'
          ? mergeHistoryFields(
              key,
              vesselData.map((data) => ({
                source: data.source,
                value: data.vessel[key] as VesselFieldsHistory,
              }))
            )
          : priorityzeFieldValue(
              key,
              vesselData.map((data) => ({ source: data.source, value: data.vessel[key] }))
            )
      return {
        ...acc,
        [key]: value,
      }
    }, {}) as VesselWithHistory
    return result
  } else {
    throw new Error('No vessel data to merge')
  }
}
