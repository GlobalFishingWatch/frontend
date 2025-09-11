export const COVERAGE_GRAPH_BUCKETS: Record<string, number> = {
  unknown: -1,
  '≤20%': 20,
  '21-40%': 40,
  '41-60%': 60,
  '61-80%': 80,
  '≥81%': 100,
}

export const CoverageGraphBuckets = Object.keys(COVERAGE_GRAPH_BUCKETS)

export function parseCoverageGraphValueBucket(value: number) {
  if (value === -1) {
    return 'unknown'
  }
  return (
    CoverageGraphBuckets.find((key) => value < COVERAGE_GRAPH_BUCKETS[key]) ||
    CoverageGraphBuckets[CoverageGraphBuckets.length - 1]
  )
}
