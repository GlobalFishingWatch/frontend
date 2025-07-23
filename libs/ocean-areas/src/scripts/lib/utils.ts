export const renderBar = (done: number, total: number, width = 30) => {
  const percent = done / total
  const filled = Math.round(percent * width)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '-'.repeat(empty)
  const pct = (percent * 100).toFixed(1)
  return `[${bar}] ${done}/${total} (${pct}%)`
}
