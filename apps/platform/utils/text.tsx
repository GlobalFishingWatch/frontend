export const getSearchPreview = (body: string = '', query: string) => {
  const q = query.toLowerCase()
  const idx = body.toLowerCase().indexOf(q)
  if (idx === -1) return body.substring(0, 200)
  const start = Math.max(0, idx - 60)
  const end = Math.min(body.length, idx + query.length + 140)
  return (start > 0 ? '…' : '') + body.substring(start, end) + (end < body.length ? '…' : '')
}
