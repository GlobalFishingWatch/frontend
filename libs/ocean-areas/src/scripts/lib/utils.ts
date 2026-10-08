export const renderBar = (done: number, total: number, width = 30) => {
  const percent = done / total
  const filled = Math.round(percent * width)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '-'.repeat(empty)
  const pct = (percent * 100).toFixed(1)
  return `[${bar}] ${done}/${total} (${pct}%)`
}

/**
 * `[west, south, east, north]` taking the short way across the antimeridian: an area with parts at
 * 163° and -177° gets `[163, …, 183, …]` (`east` past 180) instead of a box spanning the globe.
 *
 * Works on each part's longitude extent, not on single vertices: a part may span 250° between two
 * vertices. The bbox is the circle minus the widest longitude gap no part covers; when that gap is
 * the one across 180° (or there is none, as for a circumpolar area) it is the plain bbox.
 */
export const getAntimeridianBBox = (
  parts: number[][][]
): [west: number, south: number, east: number, north: number] => {
  // Loops, not `Math.min(...)`: the largest rings overflow the call stack as spread arguments
  let [south, north] = [Infinity, -Infinity]
  const extents = parts
    .map((part) => {
      let [west, east] = [Infinity, -Infinity]
      for (const [longitude, latitude] of part) {
        west = Math.min(west, longitude)
        east = Math.max(east, longitude)
        south = Math.min(south, latitude)
        north = Math.max(north, latitude)
      }
      return [west, east]
    })
    .sort((a, b) => a[0] - b[0])
  const merged: number[][] = []
  for (const [west, east] of extents) {
    const last = merged.at(-1)
    if (last && west <= last[1]) last[1] = Math.max(last[1], east)
    else merged.push([west, east])
  }
  let [west, east] = [merged[0][0], merged.at(-1)![1]]
  let widestGap = west + 360 - east
  for (let i = 1; i < merged.length; i++) {
    const gap = merged[i][0] - merged[i - 1][1]
    if (gap > widestGap) {
      widestGap = gap
      ;[west, east] = [merged[i][0], merged[i - 1][1] + 360]
    }
  }
  return [west, south, east, north]
}
