import { readFile } from 'fs/promises'

import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'

function parseCsv(csv: string): any[] {
  const [headerLine, ...lines] = csv.split(/\r?\n/).filter(Boolean)
  const headers = headerLine.split(',')
  return lines.map((line, index) => {
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
    let obj: Record<string, string> = {}
    headers.forEach((h, i) => {
      obj[h] = values[i] ?? ''
    })
    obj = Object.fromEntries(Object.entries(obj).filter(([key]) => Boolean(key))) as Record<
      string,
      string
    >

    const idField = Object.keys(obj).find((key) => key.toLowerCase().includes('imo'))
    const nameField = Object.keys(obj).find(
      (key) => key.toLowerCase().includes('name') || key.toLowerCase().includes('nome')
    )

    return {
      id: `${index}-` + (idField && obj[idField]),
      ...(nameField ? { [nameField]: obj[nameField] || '' } : {}),
      ...Object.fromEntries(Object.entries(obj).filter(([key]) => key !== nameField)),
    }
  })
}

export const Route = createFileRoute('/api/vessels/$fileName')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const fileName = params.fileName || 'scraped'
        const csv = await readFile(`./data/${fileName}.csv`, 'utf-8')
        const data = parseCsv(csv)
        return json(data)
      },
    },
  },
})
