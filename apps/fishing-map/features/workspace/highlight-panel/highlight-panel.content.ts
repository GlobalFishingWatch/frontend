import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

// Update with a new id when a new release
// This id is used for highlighting the dataview with a popup on the right
// update it here if you want to show it again
export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'vms-with-norway'

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
} & HighlighPanelConfigLocale

const HIGHLIGHT_POPUP_KEY = 'HighlightPopup'

const HIGHLIGHT_CONFIG: HighlightPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  localStorageKey: HIGHLIGHT_POPUP_KEY,
  delayed: 1000,
  imageUrl: `${PATH_BASENAME}/images/norway-vms.webp`,
  // learnMoreUrl: 'https://globalfishingwatch.org/data/ais-viirs-reveals-dark-fleet/',
  en: {
    title: "Norway's VMS data is now available",
    description:
      "Vessel monitoring system (VMS) data is provided by the Norwegian Directorate of Fisheries. It is now possible to track the position and activity of 600+ vessels comprising Norway's large scale fishing fleet.",
  },
  es: {
    title: 'Los datos VMS de Noruega ya están disponibles',
    description:
      'Los datos del sistema de monitoreo de embarcaciones (VMS) son proporcionados por la Dirección de Pesca de Noruega. Ahora es posible rastrear la posición y la actividad de más de 600 embarcaciones que componen la flota pesquera a gran escala de Noruega.',
  },
}

export default HIGHLIGHT_CONFIG
