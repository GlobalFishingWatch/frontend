import { uniqBy } from 'es-toolkit'

import styles from './ReportSummaryByLayer.module.css'
import tagsStyles from './ReportSummaryTags.module.css'

type DataviewSource = { id: string; label: string }

export const getReportSourcesWithVessels = (
  sources: DataviewSource[],
  datasetIdsWithVessels?: string[] | null
): string[] => {
  return uniqBy(sources, (source) => source.id)
    .filter((source) => !datasetIdsWithVessels || datasetIdsWithVessels.includes(source.id))
    .map((source) => source.label)
}

export type ReportHoursByLayer = {
  color?: string
  hours: string
  imprecision?: number
}

const HEX_COLOR = /^#[0-9a-f]{3,8}$/i

const IMPRECISION_FAQ_URL =
  'https://globalfishingwatch.org/faqs/calculating-fishing-effort-estimates-in-dynamic-analysis-reports/'

type ImprecisionHtmlOptions = {
  learnMoreTitle?: string
}

export const getImprecisionHtml = (
  imprecision: number,
  { learnMoreTitle }: ImprecisionHtmlOptions = {}
) =>
  learnMoreTitle
    ? `<a href="${IMPRECISION_FAQ_URL}" target="_blank" rel="noopener noreferrer" style="cursor: help" title="${learnMoreTitle}" class="${styles.imprecision}">± ${imprecision}%</a>`
    : `<span class="${styles.imprecision}">± ${imprecision}%</span>`

export const getByLayerHtml = (
  byLayer: ReportHoursByLayer[],
  imprecisionOptions: ImprecisionHtmlOptions = {}
) => {
  const layers = byLayer.map(({ color, hours, imprecision }) => {
    const dot =
      color && HEX_COLOR.test(color)
        ? `<span class="${tagsStyles.dot} ${styles.inlineDot}" style="color:${color}"></span> `
        : ''
    const error = imprecision ? ` ${getImprecisionHtml(imprecision, imprecisionOptions)}` : ''
    return `${dot}${hours}${error}`
  })
  return layers.join(', ')
}
