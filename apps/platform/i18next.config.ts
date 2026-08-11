import { defineConfig } from 'i18next-cli'

const foldersToExtract = [
  'data',
  'features',
  'hooks',
  'pages',
  'router',
  'routes',
  'server',
  'store',
  'types',
  'utils',
]

const DYNAMIC_SUBTREES = [
  'analysis.migramar.category_*', // ReportEnvironmentMigramarGraph
  'common.sourceOptions.*', // report-vessels.selectors.ts
  'dataview.*', // ContextAreaLayerPanel / VesselAreas data warnings, keyed by dataview id
  'datasetUpload.errors.*', // API dynamic properties
  'map.screenshotArea.*', // MapControlScreenshot
  'search.searchTypes.*', // MapSearch, keyed by OceanAreaType
  'user.badges.*', // UserInfo
  'vessel.fleetCodes.*', // formatInfoField('fleetCode') — VMS Brazil
  'vessel.gearTypes.*', // getVesselGearTypeLabel
  'vessel.licenseStatus.*', // formatInfoField('fishingLicenseStatus') — VMS Brazil
  'vessel.vesselTypes.*', // getVesselShipTypeLabel
]

const DYNAMIC_KEYS = [
  // t.common[x] — activity units, durations, track fields, upload errors
  'common.context',
  'common.coverage',
  'common.fishing',
  'common.help',
  'common.hour',
  'common.km/h',
  'common.m/s',
  'common.messages_one',
  'common.messages_other',
  'common.minute',
  'common.minute_one',
  'common.minute_other',
  'common.numEvents',
  'common.onlyVisibleForGFWShort',
  'common.plus',
  'common.previously',
  'common.report',
  'common.sentinel2',
  'common.summary',
  'common.vesselPresence',
  // t.datasetUpload[id] — TimeFieldsGroup
  'datasetUpload.date',
  'datasetUpload.dateRange',
  'datasetUpload.none',
  // t.event[eventType] / t.event[`${portType}ActionIn`]
  'event.dayAbbreviated',
  'event.during',
  'event.gaps',
  'event.hourAbbreviated',
  'event.minuteAbbreviated',
  'event.monthAbbreviated',
  'event.port_entryActionIn',
  'event.port_exitActionIn',
  'event.port_visit',
  'event.port_visitAction',
  'event.port_visitActionIn',
  'event.port_visitedAfter',
  'event.yearAbbreviated',
  // t.layer[filter] — dataviews.filters.ts schema filter labels
  'layer.areas.port',
  'layer.distance_from_port_km',
  'layer.duration',
  'layer.fleet_other',
  'layer.gearType_other',
  'layer.next_port_id',
  'layer.radiance',
  'layer.vessel-groups',
  'layer.vesselGroup',
  // plural base form for t(t.search.seeVesselsOnMap, { count })
  'search.seeVesselsOnMap',
  // t.time[keyBase] — utils/dates.ts
  'time.days',
  'time.hours',
  'time.minutes',
  'time.months',
  'time.weeks',
  // t.userGuide[slug] — UserGuideLink
  'userGuide.activity-fishing',
  'userGuide.activity-vessel-presence',
  'userGuide.analysis-and-dynamic-reports',
  'userGuide.downloading-data',
  'userGuide.filtering-activity-layers',
  'userGuide.night-light-detections-visible-infrared-imaging-radiometer-suite',
  'userGuide.radar-detections-synthetic-aperture-radar',
  'userGuide.upload-points',
  'userGuide.upload-polygons',
  'userGuide.upload-tracks',
  'userGuide.uploading-data',
  'userGuide.vessel-groups',
  'userGuide.vessel-search',
  // t.vessel[field] — identity fields, advanced search, data terminology
  'vessel.authorization',
  'vessel.beam',
  'vessel.builtYear',
  'vessel.capacity',
  'vessel.carrier',
  'vessel.chdSpecies',
  'vessel.codMarinha',
  'vessel.dataset',
  'vessel.depthM',
  'vessel.enginePowerKw',
  'vessel.firstTransmissionDate',
  'vessel.fishingLicenseCode',
  'vessel.fishingLicenseEndDate',
  'vessel.fishingLicenseStartDate',
  'vessel.fishingLicenseStatus',
  'vessel.fishingZone',
  'vessel.fleetCode',
  'vessel.gfwPredictions',
  'vessel.grossTonnage',
  'vessel.grossTonnageRange',
  'vessel.holdCapacityM3',
  'vessel.horsePower',
  'vessel.lastTransmissionDate',
  'vessel.length',
  'vessel.lengthM',
  'vessel.lengthRange',
  'vessel.license_category',
  'vessel.licenseCode',
  'vessel.licenseDescription',
  'vessel.mainGear',
  'vessel.maxSpeedKn',
  'vessel.neural_vessel_type',
  'vessel.notMatched',
  'vessel.registeredGearType',
  'vessel.resolution',
  'vessel.selfReportedByVessel',
  'vessel.sourceFleet',
  'vessel.target_species',
  'vessel.targetSpecies',
  'vessel.tonnageGt',
  'vessel.unkwownVesselByGeartype',
  'vessel.vessel_type',
  'vessel.vesselRegistrationCode',
  'vessel.widthRange',
  // t.workspace.categories[category] — nav.config.ts; siteDescription per category
  'workspace.categories.fishing-activity',
  'workspace.categories.marine-manager',
  'workspace.categories.reports',
  'workspace.siteDescription.fishing-activity',
  'workspace.siteDescription.marine-manager',
]

/** Namespaces filled in by hand, never extracted. */
const HAND_MANAGED_NAMESPACES = ['layer-library:*', 'workspaces:*']

export default defineConfig({
  locales: ['source'],
  extract: {
    input: foldersToExtract.map((folder) => `./${folder}/**/*.{js,jsx,ts,tsx}`),
    ignore: [
      // `extract --watch --with-types` writes features/i18n/i18n.types.d.ts, which the
      // input glob above would otherwise match — the watcher would retrigger itself.
      '**/*.d.ts',
      '**/*.md',
      '**/*.css',
      '**/*.css.module',
      '**/*.test.*',
      '**/*.spec.*',
      '**/test-results/**',
      '**/__traces__/**',
    ],
    output: 'public/locales/{{language}}/{{namespace}}.json',
    defaultNS: 'translations',
    sort: true,
    keySeparator: '.',
    nsSeparator: ':',
    contextSeparator: '_',
    preservePatterns: [...DYNAMIC_SUBTREES, ...DYNAMIC_KEYS, ...HAND_MANAGED_NAMESPACES],
    generateBasePluralForms: false,
    disablePlurals: false,
    primaryLanguage: 'en',
  },

  // TypeScript type generation
  types: {
    input: ['public/locales/source/*.json'],
    output: './features/i18n/i18next.d.ts',
    resourcesFile: './features/i18n/i18n.types.d.ts',
    enableSelector: 'optimize', // smaller/faster TS types
  },
})
