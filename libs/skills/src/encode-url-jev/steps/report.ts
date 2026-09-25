import { choice, noul } from '@typesafe-ai/sdk'

import { getLayerInfo } from '../../encode-url/dictionary'

import { getPage } from './route'
import type { Step } from './step'

// How a report is shown. Asked only when the page is a report, and the events grouping only
// when event layers are in play.

const REPORT_PAGES = ['report', 'workspace_and_report']
const BUFFER_REGEX = /(\d+(?:\.\d+)?)\s*(nm|nautical miles?|km|kilometers?|kilometres?)\b/i

export type ReportDecision = {
  /** `reportEventsGraph` value */
  eventsGraph?: string
  /** Report over the area plus its surroundings ("close to", "around") */
  buffer?: { value: number; unit: 'nauticalmiles' | 'kilometers' }
}

const DEFAULT_BUFFER: NonNullable<ReportDecision['buffer']> = { value: 100, unit: 'nauticalmiles' }

const getBuffer = (message: string): ReportDecision['buffer'] => {
  const match = message.match(BUFFER_REGEX)
  if (!match) return DEFAULT_BUFFER
  return {
    value: Number(match[1]),
    unit: match[2].toLowerCase().startsWith('k') ? 'kilometers' : 'nauticalmiles',
  }
}

export const reportStep: Step<ReportDecision, 'route' | 'layers'> = {
  needs: ['route', 'layers'],
  questions(ctx, { route, layers }) {
    if (!REPORT_PAGES.includes(getPage(ctx, route))) return {}
    const showsEvents =
      layers.ids.some((id) => getLayerInfo(id).category === 'events') ||
      ctx.current?.layers.some((layer) => layer.visible && layer.category === 'events')
    return {
      ...(showsEvents && {
        'report.events_graph': choice(
          'Does `message` ask to group the events by a category, and by which?',
          {
            none: 'No grouping is asked. Naming a place ("in FAO 41") or a period is not a grouping',
            evolution: 'Their evolution over time, e.g. "encounters evolution"',
            byFlag:
              'By vessel flag, e.g. "by flag". Filtering to one country\'s vessels is not a grouping',
            byRFMO: 'By RFMO',
            byFAO: 'By FAO area',
            byEEZ: 'By EEZ',
          }
        ),
      }),
      'report.buffer': noul(
        'Does `message` ask about the surroundings of an area, using words like near, close to or around?'
      ),
    }
  },
  resolve(read, ctx) {
    const eventsGraph = read.choice('report.events_graph', 'the events grouping', 'none')
    return {
      ...(eventsGraph !== 'none' && { eventsGraph }),
      ...(read.yes('report.buffer') && { buffer: getBuffer(ctx.message) }),
    }
  },
}
