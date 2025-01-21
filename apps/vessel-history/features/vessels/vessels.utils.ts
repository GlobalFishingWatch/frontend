import type { VesselFieldsHistory, VesselWithHistory } from 'types';

import { VesselAPISource } from 'types'
import { typedKeys } from 'utils/shared'

type VesselFieldKey = keyof VesselWithHistory

export const NOT_AVAILABLE = 'NA'

export const formatVesselProfileId = (dataset: string, gfwId: string, tmtId: string) => {
  return `${dataset ?? NOT_AVAILABLE}_${gfwId ?? NOT_AVAILABLE}_${tmtId ?? NOT_AVAILABLE}`
}

export const parseVesselProfileId = (vesselProfileId: string) => {
  const [dataset, id, vesselMatchId] = vesselProfileId
    .split('_')
    .map((value) => (value.toLowerCase() === NOT_AVAILABLE.toLocaleLowerCase() ? undefined : value))
  return { dataset, id, vesselMatchId }
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
      source: dataValue.source,
    }))
    .sort((a, b) => {
      // If any of the values not exist, we use the other
      if (!a.value || (Array.isArray(a.value) && !a.value.length)) {
        return 1
      }
      if (!b.value || (Array.isArray(b.value) && !b.value.length)) {
        return -1
      }
      // if both exist we apply the priority
      return a.priority > b.priority ? 1 : -1
    })
    .map(({ value }) => {
      // return unique values when it's an array
      return Array.isArray(value)
        ? (value.filter((item, index) => index === value.indexOf(item)) as any)
        : value
    })
  return values.filter((value) => {
    if (Array.isArray(value) && value.length) {
      return true
    }
    if (value !== undefined && value !== '') {
      return true
    }

    return value
  })
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
  const fieldValues = getPriorityzedFieldValue(field, dataValues)

  return (fieldValues || []).reduce(
    (acc, current, sourceIndex) =>
      typedKeys<VesselFieldsHistory>(current as VesselFieldsHistory).reduce(
        (history, fieldName) => ({
          ...history,
          [fieldName]: {
            byCount: (acc[fieldName]?.byCount || []).concat(current[fieldName].byCount),
            byDate: (acc[fieldName]?.byDate || []).concat(current[fieldName].byDate),
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
      if (key.toString() === 'years') {
        return {
          ...acc,
          years: vesselData
            .map((data) => {
              return data.vessel[key] as number[]
            }).flatMap(data => data),
        }
      }
      if (key.toString() === 'firstTransmissionDate') {
        return {
          ...acc,
          firstTransmissionDate: vesselData.reduce((lastDate, data) => {
            if (data.vessel.firstTransmissionDate) {
              if (!lastDate || lastDate.localeCompare(data.vessel.firstTransmissionDate) === 1) {
                return data.vessel.firstTransmissionDate
              }
            }
            return lastDate
          }, '')
        }
      }
      if (key.toString() === 'lastTransmissionDate') {
        return {
          ...acc,
          lastTransmissionDate: vesselData.reduce((lastDate, data) => {
            if (data.vessel.lastTransmissionDate) {
              if (!lastDate || lastDate.localeCompare(data.vessel.lastTransmissionDate) === -1) {
                return data.vessel.lastTransmissionDate
              }
            }
            return lastDate
          }, '')
        }
      }
      if (key.toString() === 'posCount') {
        return {
          ...acc,
          posCount: vesselData.reduce((sum, data) => {
            return sum + ((data.vessel[key] ?? 0) as number)
          }, 0)
        }
      }
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
