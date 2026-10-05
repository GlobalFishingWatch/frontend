/**
 * Renders one map screenshot per port and saves it as <out>/ports/<portId>@2x.webp
 *
 * Opens the ports-report route with the same state `PortsReportLink` builds in the app: satellite
 * basemap, heatmaps off, and the port-visits cluster layer filtered to the port. Ports are points,
 * so the viewport is a fixed zoom on the port instead of a bbox fit. Browser side: `lib/capture.ts`.
 *
 *   pnpm nx run ocean-areas:screenshots-ports --args="--limit 5"
 *   pnpm nx run ocean-areas:screenshots-ports --args="--flag CHN --concurrency 4"
 *   pnpm nx run ocean-areas:screenshots-ports --args="--id chn-binhai --force"
 *
 * Always through the nx target, for the same reasons as `screenshots.ts`.
 */
import type { Feature, Point } from 'geojson'
import { parseArgs } from 'node:util'

import type { BaseUrlWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import { stringifyWorkspace } from '@globalfishingwatch/dataviews-client/url-workspace'
import {
  AIS_DATAVIEW_INSTANCE_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'

import ports from '../data/ports.json' with { type: 'json' }
import type { OceanAreaProperties } from '../ocean-areas'

import type { CaptureJob } from './lib/capture.ts'
import { BASE_URL, CAPTURE_OPTIONS, captureAll, PATH_BASENAME } from './lib/capture.ts'

type PortFeature = Feature<Point, OceanAreaProperties & { flag: string }>

const PORT_VISITS_DATASET_ID = 'public-global-port-visits-events:v5.0'

const { values: opts } = parseArgs({
  options: {
    ...CAPTURE_OPTIONS,
    /** comma list of ISO3 flags, e.g. `CHN,ESP` */
    flag: { type: 'string' },
    /** comma list of port ids, e.g. `chn-binhai` */
    id: { type: 'string' },
    // Above 8 the basemap switches to the Google satellite tileset, which is what makes a port
    // legible at all. ~14-15 frames the harbour the way the app's own port links do.
    zoom: { type: 'string', default: '14' },
  },
})

const list = (value?: string) => value?.split(',').map((v) => v.trim().toLowerCase())

/** The workspace-state keys this script sets, on top of the viewport ones in `BaseUrlWorkspace`. */
type PortScreenshotWorkspace = BaseUrlWorkspace & {
  screenshotMode: boolean
  sidebarOpen: boolean
  reportCategory: string
  portsReportName: string
  portsReportCountry: string
  portsReportDatasetId: string
  dataviewInstances: { id: string; config: Record<string, unknown> }[]
}

export function getPortUrl({ geometry, properties }: PortFeature, zoom = Number(opts.zoom)) {
  const portId = String(properties.area)
  const [longitude, latitude] = geometry.coordinates
  const workspace: PortScreenshotWorkspace = {
    longitude,
    latitude,
    zoom,
    screenshotMode: true,
    sidebarOpen: false,
    reportCategory: 'events',
    portsReportName: properties.name,
    portsReportCountry: properties.flag,
    portsReportDatasetId: PORT_VISITS_DATASET_ID,
    dataviewInstances: [
      { id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID, config: { basemap: 'satellite' } },
      { id: AIS_DATAVIEW_INSTANCE_ID, config: { visible: false } },
      { id: VMS_DATAVIEW_INSTANCE_ID, config: { visible: false } },
      {
        id: PORT_VISITS_EVENTS_SOURCE_ID,
        config: {
          visible: true,
          clusterMaxZoomLevels: { default: 20 },
          filters: { port_id: portId },
        },
      },
    ],
  }
  const path = `${PATH_BASENAME}/map/fishing-activity/default-public/ports-report/${encodeURIComponent(portId)}`
  return `${BASE_URL}${path}?${stringifyWorkspace(workspace)}`
}

function loadQueue(): CaptureJob[] {
  const flags = list(opts.flag)
  const ids = list(opts.id)
  return (ports as PortFeature[])
    .filter(({ properties }) => !flags || flags.includes(properties.flag.toLowerCase()))
    .filter(({ properties }) => !ids || ids.includes(String(properties.area)))
    .slice(0, opts.limit ? Number(opts.limit) : Infinity)
    .map((port) => {
      const portId = String(port.properties.area).replace(/[^\w.-]/g, '_')
      return { url: getPortUrl(port), file: `${opts.out}/ports/${portId}@2x.webp` }
    })
}

function selftest(): void {
  const url = getPortUrl(
    {
      type: 'Feature',
      properties: { type: 'port', area: 'chn-binhai', name: 'BINHAI', flag: 'CHN' },
      geometry: { type: 'Point', coordinates: [120.28, 34.29] },
    },
    14
  )
  console.assert(url.includes('/ports-report/chn-binhai?'), 'ports-report path', url)
  console.assert(url.includes('portsReportCountry=CHN'), 'country param', url)
  console.assert(url.includes('%5Bport_id%5D=chn-binhai'), 'port_id filter', url)
  console.assert(url.includes('zoom=14'), 'zoom', url)
  console.log('selftest ok')
}

if (opts.selftest) {
  selftest()
} else {
  await captureAll(loadQueue(), {
    width: Number(opts.width),
    height: Number(opts.height),
    quality: Number(opts.quality),
    concurrency: Number(opts.concurrency),
    out: opts.out,
    force: opts.force,
    upload: opts.upload,
  })
}
