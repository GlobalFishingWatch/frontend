import { Locale } from '../../../types'
import {
  IS_PRODUCTION_BUILD,
  IS_PRODUCTION_WORKSPACE_ENV,
  PATH_BASENAME,
} from '../../../data/config'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
    learnMoreUrl?: string
  }
}

export type HighlightPanelConfig = {
  dataviewInstanceId: string
  localStorageKey: string
  imageUrl: string
  learnMoreUrl?: string
  delayed?: number
  workspaceUrl?: string
  releaseDateTimestamp: number
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

/**
 * To use as releaseDateTimestamp while the release date is not yet defined.
 *
 * Eg:
 * {
 *   dataviewInstanceId: 'vms-with-some-country',
 *   releaseDateTimestamp: NEXT_YEAR,
 *   localStorageKey: HIGHLIGHT_POPUP_KEY,
 *   delayed: 1000,
 *   ...
 * }
 *
 */
const NEXT_YEAR = Date.now() + 1000 * 60 * 60 * 24 * 365
const BASE_HIGHLIGHT_CONFIG = {
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  delayed: 1000,
}
// To display a new highlight popup, just add a HighlightPanelConfig element to this array.
// It's important to define a unique dataviewInstanceId and the releaseDateTimestamp
// so that the popup is shown in production only after that date
const HIGHLIGHT_CONFIGS: HighlightPanelConfig[] = [
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'fishing-ais',
    releaseDateTimestamp: Date.parse('2024-04-08T00:00:00Z'),
    imageUrl: ``,
    learnMoreUrl: 'https://globalfishingwatch.org/faqs/2024-april-data-error/',
    en: {
      title:
        'Resolved - Global Fishing Watch has resolved an underlying AIS data error in the platform.',
      description:
        'If you accessed Global Fishing Watch AIS or VMS data between 26 January - 10 April 2024, there may be errors in the fishing effort and fishing event data. The AIS error has been resolved, and we are working on the VMS issue now. Our advice is to repeat any analysis completed with the correct data. We’re sorry for any inconvenience caused.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'bathymetry-workspace',
    releaseDateTimestamp: Date.parse('2024-01-08T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/chlorophyl@2x.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/platform-updates/',
    en: {
      title: 'New environmental data sources added',
      description:
        'Global Fishing Watch has added new datasets, including dynamic oceanographic and ecosystem data following your feedback. Explore the new datasets alongside human activity, and analyze them through space and time using dynamic reports to learn more about your area of interest.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'sar',
    releaseDateTimestamp: Date.parse('2024-01-04T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/sar.webp`,
    learnMoreUrl:
      'https://globalfishingwatch.org/press-release/new-research-harnesses-ai-and-satellite-imagery-to-reveal-the-expanding-footprint-of-human-activity-at-sea',
    en: {
      title: 'Data added from satellite radar reveals industrial vessels hidden from public view',
      description:
        'Global Fishing Watch has added an open global radar detections layer, derived from synthetic aperture radar or SAR, to display vessels at sea in any weather conditions. SAR can show vessels that can not be picked up by other cooperative tracking systems and infrastructure at sea like oil platforms and wind farms.',
    },
  },
  {
    ...BASE_HIGHLIGHT_CONFIG,
    dataviewInstanceId: 'vms-with-png',
    releaseDateTimestamp: Date.parse('2023-06-01T00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/papua_new_guinea-vms.webp`,
    learnMoreUrl: 'https://globalfishingwatch.org/papua-new-guinea',
    en: {
      title: 'Papua New Guinea’s VMS data is now available',
      description:
        'Vessel monitoring system (VMS) data is provided by the National Fisheries Authority of Papua New Guinea. It is now possible to track the position and activity of all vessels comprising the Fishing Industry Association of Papua New Guinea’s fishing fleet operating in Papua New Guinea’s national waters.',
    },
    es: {
      title: 'Los datos VMS de Papúa Nueva Guinea ya están disponibles',
      description:
        'Los datos del sistema de monitoreo de embarcaciones (VMS) son proporcionados por la Autoridad Nacional de Pesca de Papúa Nueva Guinea. Ahora es posible rastrear la posición y la actividad de todos los barcos que componen la flota pesquera de la Asociación de la Industria Pesquera de Papúa Nueva Guinea que opera en las aguas nacionales de Papúa Nueva Guinea.',
    },
    fr: {
      title: 'Les données VMS de la Papouasie-Nouvelle-Guinée sont désormais disponibles',
      description:
        "Les données du système de surveillance des navires (VMS) sont fournies par l'Autorité nationale des pêches de Papouasie-Nouvelle-Guinée. Il est désormais possible de suivre la position et l'activité de tous les navires de la flotte de pêche de l'Association de l'industrie de la pêche de Papouasie-Nouvelle-Guinée opérant dans les eaux nationales de Papouasie-Nouvelle-Guinée.",
    },
    pt: {
      title: 'Os dados VMS da Papua Nova Guiné estão disponíveis',
      description:
        'Os dados do sistema de monitoramento de embarcações (VMS) são fornecidos pela Autoridade Pesqueira Nacional de Papua Nova Guiné. Agora é possível rastrear a posição e a atividade de todas as embarcações que compõem a frota de pesca da Associação da Indústria Pesqueira da Papua Nova Guiné que opera nas águas nacionais da Papua Nova Guiné.',
    },
  },
]

const AVAILABLE_HIGHLIGHT_CONFIGS = HIGHLIGHT_CONFIGS
  // sort them by release date descending
  .sort((a, b) => (a.releaseDateTimestamp > b.releaseDateTimestamp ? -1 : 1))
const HIGHLIGHT_CONFIG_LATEST = AVAILABLE_HIGHLIGHT_CONFIGS.at(0) as HighlightPanelConfig
const HIGHLIGHT_CONFIG_PREVIOUS = AVAILABLE_HIGHLIGHT_CONFIGS.at(1) as HighlightPanelConfig

const IS_PRODUCTION_ENV = IS_PRODUCTION_BUILD && IS_PRODUCTION_WORKSPACE_ENV

const DISPLAY_LATEST_POPUP =
  // Non production environments always show the latest popup
  !IS_PRODUCTION_ENV ||
  // Production displays the latest only after its release date
  Date.now() >= (HIGHLIGHT_CONFIG_LATEST?.releaseDateTimestamp as number)

const HIGHLIGHT_CONFIG = DISPLAY_LATEST_POPUP ? HIGHLIGHT_CONFIG_LATEST : HIGHLIGHT_CONFIG_PREVIOUS

export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = HIGHLIGHT_CONFIG?.dataviewInstanceId

export const getDataviewInstanceReleaseDate = (instanceId: string) => {
  return (
    HIGHLIGHT_CONFIGS.find((c) => c.dataviewInstanceId === instanceId)?.releaseDateTimestamp ||
    NEXT_YEAR
  )
}
export default HIGHLIGHT_CONFIG
