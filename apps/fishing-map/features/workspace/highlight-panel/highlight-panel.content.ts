import {
  AIS_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
} from 'data/highlighted-workspaces/report.dataviews'

import {
  IS_PRODUCTION_BUILD,
  IS_PRODUCTION_WORKSPACE_ENV,
  PATH_BASENAME,
} from '../../../data/config'
import type { Locale } from '../../../types'

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
// const NEXT_YEAR = Date.now() + 1000 * 60 * 60 * 24 * 365
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
    dataviewInstanceId: SENTINEL2_DATAVIEW_INSTANCE_ID,
    releaseDateTimestamp: Date.parse('2025-07-10T18:00:00:00Z'),
    imageUrl: `${PATH_BASENAME}/images/highlighted-popup/sentinel2.jpg`,
    learnMoreUrl: 'https://globalfishingwatch.org/article/expanding-our-view-with-sentinel-2/',
    en: {
      title: 'New satellite source reveals human activity with vessel imagery',
      description:
        'Global Fishing Watch has added a new vessel detections layer based on Sentinel-2 optical satellite imagery. This dataset lets you view vessels detected in clear weather and daylight, including smaller vessels often missed by radar or not available in other tracking systems. Each detection includes an image thumbnail, allowing you to visually inspect vessels directly in satellite imagery.',
    },
    es: {
      title: 'Nueva fuente satelital revela la actividad humana con imágenes de embarcaciones',
      description:
        'Global Fishing Watch ha añadido una nueva capa de detección de embarcaciones basada en imágenes satelitales ópticas de Sentinel-2. Este conjunto de datos permite visualizar embarcaciones detectadas en condiciones de buen tiempo y durante el día, incluidas embarcaciones más pequeñas que a menudo no son detectadas por radar u otros sistemas de monitoreo. Cada detección incluye una miniatura de la imagen, lo que permite inspeccionar visualmente las embarcaciones directamente en la imagen satelital.',
    },
    fr: {
      title: 'Nouvelle source satellite révélant l’activité humaine grâce à l’imagerie des navires',
      description:
        'Global Fishing Watch a ajouté une nouvelle couche de détection des navires basée sur les images satellites optiques Sentinel-2. Ce jeu de données permet de visualiser les navires détectés par temps clair et en plein jour, y compris les plus petits navires souvent non détectés par le radar ou d’autres systèmes de suivi. Chaque détection inclut une vignette d’image, permettant d’inspecter visuellement les navires directement dans l’image satellite.',
    },
    pt: {
      title: 'Nova fonte de satélite revela atividade humana com imagens de embarcações',
      description:
        'A Global Fishing Watch adicionou uma nova camada de detecção de embarcações baseada em imagens ópticas de satélite do Sentinel-2. Esse conjunto de dados permite visualizar embarcações detectadas em condições de tempo claro e durante o dia, incluindo embarcações menores que muitas vezes não são detectadas por radar ou outros sistemas de rastreamento. Cada detecção inclui uma miniatura da imagem, permitindo inspecionar visualmente as embarcações diretamente na imagem de satélite.',
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

export default HIGHLIGHT_CONFIG
