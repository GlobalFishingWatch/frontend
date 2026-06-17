import { uniqBy } from 'es-toolkit'

type DataviewSource = { id: string; label: string }

export const getReportSourcesWithVessels = (
  sources: DataviewSource[],
  datasetIdsWithVessels?: string[] | null
): string[] => {
  return uniqBy(sources, (source) => source.id)
    .filter((source) => !datasetIdsWithVessels || datasetIdsWithVessels.includes(source.id))
    .map((source) => source.label)
}
