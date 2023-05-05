import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

// Update with a new id when a new release
// This id is used for highlighting the dataview with a popup on the right
// update it here if you want to show it again
export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'vms-with-png'

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
  imageUrl: `${PATH_BASENAME}/images/papua_new_guinea-vms.webp`,
  learnMoreUrl:
    'https://globalfishingwatch.org/press-release/papua-new-guinea-to-share-vessel-data/',
  en: {
    title: 'Papua New Guinea’s VMS data is now available',
    description:
      'Vessel monitoring system (VMS) data is provided by the National Fisheries Authority of Papua New Guinea. It is now possible to track the position and activity of all vessels comprising the Fishing Industry Association of Papua New Guinea’s fishing fleet operating in Papua New Guinea’s national waters.',
  },
  es: {
    title: 'Los datos VMS de Noruega ya están disponibles',
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
      'Os dados do sistema de monitoramento de embarcações (VMS) são fornecidos pela Autoridade Nacional de Pesca de Papua Nova Guiné. Agora é possível rastrear a posição e a atividade de todas as embarcações que compõem a frota de pesca da Associação da Indústria Pesqueira da Papua Nova Guiné que opera nas águas nacionais da Papua Nova Guiné.',
  },
}

export default HIGHLIGHT_CONFIG
