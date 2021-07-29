import { typedKeys } from 'utils/shared'
import { ValueItem, VesselAPISource, VesselFieldsHistory, VesselWithHistory } from 'types'

type VesselFieldKey = keyof VesselWithHistory

export const formatVesselProfileId = (dataset: string, gfwId: string, tmtId: string) => {
  return `${dataset ?? 'NA'}_${gfwId ?? 'NA'}_${tmtId ?? 'NA'}`
}

const getFieldPriority = (field: VesselFieldKey): VesselAPISource[] => {
  return [VesselAPISource.GFW, VesselAPISource.TMT]
}

const getPriorityzedFieldValue = <T = any>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
): T[] => {
  const fieldPriority = getFieldPriority(field)
  const values = dataValues
    .filter(({ value }) => value !== null && value !== undefined)
    .map((dataValue) => ({
      value: dataValue.value,
      priority: fieldPriority.indexOf(dataValue.source),
    }))
    .sort((a, b) => (a.priority > b.priority ? 1 : -1))
    .map(({ value }) =>
      // return unique values when it's an array
      Array.isArray(value)
        ? (value.filter((item, index) => index === value.indexOf(item)) as any)
        : value
    )

  return values.filter((value) => value)
}

const priorityzeFieldValue = <T>(
  field: VesselFieldKey,
  dataValues: { source: VesselAPISource; value: T }[]
) => {
  return getPriorityzedFieldValue(field, dataValues).slice(0, 1).shift() as T
}

const mergeHistoryFields = (
  field: VesselFieldKey,
  dataValues: {
    source: VesselAPISource
    value: VesselFieldsHistory
    vessel: VesselWithHistory
  }[]
) => {
  const fieldValues = getPriorityzedFieldValue<VesselFieldsHistory>(field, dataValues)

  const getFieldHistory = (
    fieldName: keyof VesselFieldsHistory,
    vessel: VesselWithHistory,
    source: VesselAPISource
  ) => {
    const fieldActualValue =
      vessel.history[fieldName].byDate.length === 0
        ? vessel[fieldName as VesselFieldKey]
        : undefined
    return vessel.history[fieldName].byDate
      .map((item) => ({ ...item, source } as ValueItem))
      .concat(fieldActualValue ? [{ source, value: fieldActualValue } as ValueItem] : [])
  }
  return (fieldValues || []).reduce(
    (acc, current, sourceIndex) =>
      typedKeys<VesselFieldsHistory>(current as VesselFieldsHistory).reduce(
        (history, fieldName) => ({
          ...history,
          [fieldName]: {
            byCount: (acc[fieldName]?.byCount || []).concat(current[fieldName].byCount),
            byDate: (acc[fieldName]?.byDate || []).concat(
              getFieldHistory(
                fieldName,
                dataValues[sourceIndex].vessel,
                dataValues[sourceIndex].source
              )
            ),
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
                vessel: data.vessel,
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
