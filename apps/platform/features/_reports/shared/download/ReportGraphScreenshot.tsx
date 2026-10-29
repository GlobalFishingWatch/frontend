import type { RefObject } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { Button } from '@globalfishingwatch/ui-components/button'
import type { ChoiceOption } from '@globalfishingwatch/ui-components/choice'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Modal } from '@globalfishingwatch/ui-components/modal'
import { SwitchRow } from '@globalfishingwatch/ui-components/switch-row'

import { useTimerangeConnect } from 'features/_map/timebar/timerange.hooks'
import { selectReportAreaName } from 'features/_reports/report-area/area-reports.selectors'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectIsVesselGroupReportLocation } from 'router/routes.selectors'

import ReportGraphLegend from './ReportGraphLegend'
import ReportGraphSummary from './ReportGraphSummary'

import styles from './ReportGraphScreenshot.module.css'

type ReportGraphScreenshotFormat = 'png' | 'svg'

const FORMAT_OPTIONS: ChoiceOption<ReportGraphScreenshotFormat>[] = [
  { id: 'png', label: 'PNG' },
  { id: 'svg', label: 'SVG' },
]

// Recharts keeps the last hovered point active after the mouse leaves the graph
const HOVER_SELECTORS = '.recharts-tooltip-wrapper, .recharts-tooltip-cursor, .recharts-active-dot'

/**
 * A static copy of the graph as it is on screen, sized like the original so the summary and
 * legend around it wrap to the graph width
 */
const cloneGraph = (graph: HTMLElement) => {
  const clone = graph.cloneNode(true) as HTMLElement
  clone.querySelectorAll(HOVER_SELECTORS).forEach((element) => element.remove())
  clone.style.width = `${graph.offsetWidth}px`
  return clone
}

type ReportGraphScreenshotProps = {
  graphRef: RefObject<HTMLDivElement | null>
  name: string
  withSummary?: boolean
  filter?: string
}

function ReportGraphScreenshot({
  graphRef,
  name,
  withSummary,
  filter,
}: ReportGraphScreenshotProps) {
  const { t } = useTranslation()
  const { start, end } = useTimerangeConnect()
  const reportAreaName = useSelector(selectReportAreaName)
  const isVesselGroupReportLocation = useSelector(selectIsVesselGroupReportLocation)
  const [open, setOpen] = useState(false)
  const [format, setFormat] = useState<ReportGraphScreenshotFormat>('png')
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeLegend, setIncludeLegend] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const showSummary = withSummary && includeSummary
  const showLegend = withSummary && includeLegend && !isVesselGroupReportLocation

  const graphCopyRef = useCallback(
    (container: HTMLDivElement | null) => {
      if (container && graphRef.current) {
        container.replaceChildren(cloneGraph(graphRef.current))
      }
    },
    [graphRef]
  )

  const onDownload = async () => {
    if (!imageRef.current) return
    setDownloading(true)
    try {
      const { snapdom } = await import('@zumer/snapdom')
      const filename = ['GFW', name, reportAreaName, start?.slice(0, 10), end?.slice(0, 10)]
        .filter(Boolean)
        .join('-')
      if (format === 'svg') {
        // snapdom writes no XML declaration, so viewers not assuming UTF-8 garble non-ASCII text
        const svg = await (await snapdom.toBlob(imageRef.current, { format: 'svg' })).text()
        const { saveAs } = await import('file-saver')
        saveAs(
          new Blob(
            [svg.startsWith('<?xml') ? svg : `<?xml version="1.0" encoding="UTF-8"?>\n${svg}`],
            {
              type: 'image/svg+xml;charset=utf-8',
            }
          ),
          `${filename}.svg`
        )
      } else {
        // download() always writes at dpr 1, scale keeps the PNG sharp
        await snapdom.download(imageRef.current, { format, filename, scale: 2 })
      }
      trackEvent({
        category: TrackCategory.Analysis,
        action: 'report_graph_download',
        label: [name, format, showSummary && 'summary', showLegend && 'legend']
          .filter(Boolean)
          .join('_'),
      })
    } catch (e) {
      console.warn(e)
    }
    setDownloading(false)
    setOpen(false)
  }

  return (
    <Fragment>
      <IconButton
        icon="camera"
        type="border"
        size="medium"
        className={styles.button}
        tooltip={t((t) => t.analysis.graphScreenshot)}
        tooltipPlacement="top"
        onClick={() => setOpen(true)}
      />
      <Modal
        title={t((t) => t.map.screenshotPreview)}
        isOpen={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
        contentClassName={styles.content}
      >
        <div className={styles.preview}>
          <div className={styles.frame}>
            {/* Everything inside this element is what ends up in the image */}
            <div ref={imageRef} className={styles.image}>
              {showSummary && (
                <ReportGraphSummary vesselsFiltered={!!filter} hideSources={showLegend} />
              )}
              <div ref={graphCopyRef} />
              {filter && (
                <p className={styles.legend}>
                  {t((t) => t.analysis.graphScreenshotFilter)}: {filter}
                </p>
              )}
              {showLegend && <ReportGraphLegend />}
            </div>
          </div>
        </div>
        <div className={styles.previewFooter}>
          <Choice
            options={FORMAT_OPTIONS}
            activeOption={format}
            onSelect={(option) => setFormat(option.id)}
          />
          {withSummary && (
            <SwitchRow
              label={t((t) => t.analysis.graphScreenshotSummary)}
              active={includeSummary}
              onClick={() => setIncludeSummary(!includeSummary)}
            />
          )}
          {withSummary && !isVesselGroupReportLocation && (
            <SwitchRow
              label={t((t) => t.analysis.graphScreenshotLegend)}
              active={includeLegend}
              onClick={() => setIncludeLegend(!includeLegend)}
            />
          )}
          <Button loading={downloading} onClick={onDownload}>
            {t((t) => t.map.screenshotDownload)}
          </Button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default ReportGraphScreenshot
