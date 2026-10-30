import type { ReactNode, RefObject } from 'react'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { Button } from '@globalfishingwatch/ui-components/button'
import type { ChoiceOption } from '@globalfishingwatch/ui-components/choice'
import { Choice } from '@globalfishingwatch/ui-components/choice'
import { IconButton } from '@globalfishingwatch/ui-components/icon-button'
import { Logo } from '@globalfishingwatch/ui-components/logo'
import { Modal } from '@globalfishingwatch/ui-components/modal'
import { SwitchRow } from '@globalfishingwatch/ui-components/switch-row'

import { useTimerangeConnect } from 'features/_map/timebar/timerange.hooks'
import { selectReportAreaName } from 'features/_reports/report-area/area-reports.selectors'
import { selectReportCategory } from 'features/_reports/reports.selectors'
import { ReportCategory } from 'features/_reports/reports.types'
import { selectUserSettings } from 'features/_user/selectors/user.selectors'
import type { ReportGraphScreenshotSettings } from 'features/_user/user.slice'
import { setUserSetting } from 'features/_user/user.slice'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'

import ReportGraphLegend from './ReportGraphLegend'
import ReportGraphSummary from './ReportGraphSummary'

import styles from './ReportGraphScreenshot.module.css'

type ReportGraphScreenshotFormat = ReportGraphScreenshotSettings['format']

const DEFAULT_SETTINGS: ReportGraphScreenshotSettings = {
  format: 'png',
  summary: true,
  footer: true,
}

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
  // Wrappers spacing the graph in the report would add their gap to the image one
  for (let element: Element | null = clone; element; element = element.firstElementChild) {
    if (element instanceof HTMLElement) element.style.marginBlock = '0'
    if (element.childElementCount !== 1) break
  }
  return clone
}

type ReportGraphScreenshotProps = {
  graphRef: RefObject<HTMLDivElement | null>
  name: string
  /** Uses the report summary and its layers as legend */
  withSummary?: boolean
  /** Summary for graphs that are not about the report layers, replaces the report one */
  summary?: ReactNode
  /** Layers to list in the legend instead of the report ones */
  legendDataviews?: UrlDataviewInstance[]
  filter?: string
}

function ReportGraphScreenshot({
  graphRef,
  name,
  withSummary,
  summary,
  legendDataviews,
  filter,
}: ReportGraphScreenshotProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { start, end } = useTimerangeConnect()
  const reportAreaName = useSelector(selectReportAreaName)
  const reportCategory = useSelector(selectReportCategory)
  const [open, setOpen] = useState(false)
  const userSettings = useSelector(selectUserSettings)
  const {
    format,
    summary: includeSummary,
    footer: includeFooter,
  } = { ...DEFAULT_SETTINGS, ...userSettings.reportGraphScreenshot }
  const setSettings = (settings: Partial<ReportGraphScreenshotSettings>) => {
    dispatch(
      setUserSetting({
        reportGraphScreenshot: {
          format,
          summary: includeSummary,
          footer: includeFooter,
          ...settings,
        },
      })
    )
  }
  const [downloading, setDownloading] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)
  const hasSummary = withSummary || summary !== undefined
  const showSummary = hasSummary && includeSummary
  const showLegend = legendDataviews
    ? legendDataviews.length > 0
    : // The vessel group vessels tab has no layers to list
      withSummary && reportCategory !== ReportCategory.VesselGroup

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
        const svg = await (
          await snapdom.toBlob(imageRef.current, { format: 'svg', embedFonts: true })
        ).text()
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
        await snapdom.download(imageRef.current, {
          format,
          filename,
          scale: 2,
          embedFonts: true,
        })
      }
      trackEvent({
        category: TrackCategory.Analysis,
        action: 'report_graph_download',
        label: [name, format, showSummary && 'summary', includeFooter && 'footer']
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
        title={t((t) => t.analysis.graphScreenshotTitle)}
        isOpen={open}
        onClose={() => setOpen(false)}
        className={styles.modal}
        contentClassName={styles.content}
      >
        <div className={styles.preview}>
          <div className={styles.frame}>
            {/* Everything inside this element is what ends up in the image */}
            <div ref={imageRef} className={styles.image}>
              {showSummary &&
                (summary !== undefined ? (
                  <div className={styles.summary}>{summary}</div>
                ) : (
                  <ReportGraphSummary vesselsFiltered={!!filter} hideSources={showLegend} />
                ))}
              <div ref={graphCopyRef} />
              {(filter || showLegend) && (
                <div className={styles.legend}>
                  {filter && (
                    <span>
                      {t((t) => t.analysis.graphScreenshotFilter)}: {filter}
                    </span>
                  )}
                  {showLegend && <ReportGraphLegend dataviews={legendDataviews} />}
                </div>
              )}
              {includeFooter && (
                <div className={styles.footer}>
                  <span>
                    <a href={window.location.href}>www.globalfishingwatch.org/platform</a>
                  </span>
                  <Logo className={styles.logo} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className={styles.previewFooter}>
          <Choice
            options={FORMAT_OPTIONS}
            activeOption={format}
            onSelect={(option) => setSettings({ format: option.id })}
          />
          {hasSummary && (
            <SwitchRow
              label={t((t) => t.analysis.graphScreenshotSummary)}
              active={includeSummary}
              onClick={() => setSettings({ summary: !includeSummary })}
            />
          )}
          <SwitchRow
            label={t((t) => t.analysis.graphScreenshotFooter)}
            active={includeFooter}
            onClick={() => setSettings({ footer: !includeFooter })}
          />
          <Button loading={downloading} onClick={onDownload}>
            {t((t) => t.map.screenshotDownload)}
          </Button>
        </div>
      </Modal>
    </Fragment>
  )
}

export default ReportGraphScreenshot
