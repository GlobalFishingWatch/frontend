import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'

function parseCsv(csv: string): any[] {
  const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean)
  const headers = headerLine.split(',')
  return lines.map((line) => {
    const values: any[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === ',' && !inQuotes) {
        values.push(current)
        current = ''
      } else {
        current += char
      }
    }
    values.push(current)
    const obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? ''
    })
    return obj
  })
}

export const ServerRoute = createServerFileRoute('/api/vessels/$fileName').methods({
  GET: async ({ params }) => {
    const fileName = params.fileName || 'scraped'
    const csv = await readFile(`./data/${fileName}.csv`, 'utf-8')
    const data = parseCsv(csv)
    return json(data)
  },
})
