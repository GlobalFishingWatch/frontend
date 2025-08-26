import { notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import ExcelJS from 'exceljs'

import type { fieldMap, FieldMapConfig, type Vessel } from '@/types/vessel.types';


export const findBestMatchingKey = (keys: string[], fieldConfig: FieldMapConfig): string | null => {
  const allMatchingValues = [
    ...(fieldConfig.gr ? [fieldConfig.gr] : []),
    ...(fieldConfig.iccat ? [fieldConfig.iccat] : []),
    ...(fieldConfig.sprfmo ? [fieldConfig.sprfmo] : []),
    ...(fieldConfig.variants || []),
  ]

  for (const matchValue of allMatchingValues) {
    const exactMatch = keys.find((key) => key.toLowerCase() === matchValue.toLowerCase())
    if (exactMatch) return exactMatch
  }

  for (const matchValue of allMatchingValues) {
    const partialMatch = keys.find(
      (key) =>
        key.toLowerCase().includes(matchValue.toLowerCase()) ||
        matchValue.toLowerCase().includes(key.toLowerCase())
    )
    if (partialMatch) return partialMatch
  }

  return null
}

export const parseVessels = (data: Vessel[], targetSystem: 'iccat' | 'sprfmo' | 'gr') => {
  if (!data.length) return []

  const sampleKeys = Object.keys(data[0])

  const matchConfig = Object.entries(fieldMap).map(([internalKey, config]) => {
    const possibleNames = [config[targetSystem], config.gr, ...(config.variants || [])].filter(
      Boolean
    )

    return { internalKey, possibleNames, config }
  })

  return data.map((row) => {
    const normalized: Record<string, any> = {}

    matchConfig.forEach(({ internalKey, possibleNames, config }) => {
      let bestMatchKey: string | undefined

      bestMatchKey = sampleKeys.find((k) =>
        possibleNames.some((name) => k.toLowerCase() === name.toLowerCase())
      )

      if (!bestMatchKey) {
        bestMatchKey = sampleKeys.find((k) =>
          possibleNames.some((name) => k.toLowerCase().includes(name.toLowerCase()))
        )
      }

      const outputKey = config[targetSystem]
      normalized[outputKey] = bestMatchKey ? (row as any)[bestMatchKey] : null
    })

    return normalized
  })
}

export const handleExportICCATVessels = async (vessels: Vessel[] | Record<string, any>) => {
  try {
    const templateResponse = await fetch('./data/templates/iccat-template.xlsx')
    const templateBuffer = await templateResponse.arrayBuffer()

    const workbook = new ExcelJS.Workbook()
    await workbook.xlsx.load(templateBuffer)
    const worksheetName = workbook.worksheets[0]?.name
    const worksheet = workbook.getWorksheet(worksheetName)

    if (!worksheet) {
      throw new Error('Worksheet not found')
    }

    const headerRow = worksheet.getRow(23)
    const headers: { [key: string]: number } = {}

    headerRow.eachCell((cell, colNumber) => {
      if (cell.value) {
        headers[String(cell.value)] = colNumber
      }
    })

    vessels.forEach((vessel, index) => {
      const row = worksheet.getRow(24 + index)

      Object.keys(vessel).forEach((field) => {
        const colIndex = headers[field]
        if (colIndex) {
          const cell = row.getCell(colIndex)
          cell.value = vessel[field]
        }
      })
    })

    const outputBuffer = await workbook.xlsx.writeBuffer()

    const blob = new Blob([outputBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'iccat-vessels.xlsx'
    link.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error exporting ICCAT vessels from buffer:', error)
    throw error
  }
}

export const parseBasicVessels = (data: any[]): Vessel[] => {
  if (!Array.isArray(data) || !data.length) return []

  return data.map((item) => {
    const keys = Object.keys(item)

    const idKey = findBestMatchingKey(keys, fieldMap.id)
    const nameKey = findBestMatchingKey(keys, fieldMap.name)

    const remainingData = { ...item }

    if (nameKey && nameKey !== idKey) delete remainingData[nameKey]

    return {
      id: String(item[idKey ?? keys[0]] ?? ''),
      name: String(item[nameKey ?? keys[0]] ?? ''),
      ...remainingData,
    }
  })
}

export const fetchVessels = createServerFn().handler(async () => {
  const res = await fetch('/api/vessels/scraped')
  if (!res.ok) {
    if (res.status === 404) {
      throw notFound()
    }

    throw new Error('Failed to fetch post')
  }

  const vessels = (await res.json()) as Vessel[]
  return parseBasicVessels(vessels)
})
