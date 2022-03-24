import { PATH_BASENAME } from 'routes/routes'
import { Locale } from 'types'

// Update with a new id when a new release
export const HIGHLIGHT_DATAVIEW_INSTANCE_ID = 'highlight-vms-with-costarica'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
    learnMoreUrl?: string
  }
}

export type HighlighPanelConfig = {
  dataviewInstanceId: string
  imageUrl: string
  learnMoreUrl: string
} & HighlighPanelConfigLocale

const highlightPanelConfig: HighlighPanelConfig = {
  dataviewInstanceId: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
  imageUrl: `${PATH_BASENAME}/images/costa-rica-vms.jpg`,
  learnMoreUrl: 'https://globalfishingwatch.org/costa-rica',
  en: {
    title: 'Costa Rica VMS data is now available',
    description:
      'Vessel monitoring system (VMS) data is provided by the Costa Rican Fisheries and Aquaculture Institute. It is possible to track the position and activity of 100+ vessels comprising Costa Rica’s industrial and international fishing fleets.',
  },
  es: {
    title: 'Los datos de VMS de Costa Rica ya están disponibles',
    description:
      'Los datos del sistema de seguimiento de embarcaciones (VMS) son proporcionados por el Instituto Costarricense de Pesca y Acuicultura. Es posible rastrear la posición y actividad de más de 100 embarcaciones que comprenden las flotas pesqueras industriales e internacionales de Costa Rica.',
    learnMoreUrl: 'https://globalfishingwatch.org/es/costa-rica',
  },
  fr: {
    title: 'Les données VMS du Costa Rica sont maintenant disponibles',
    description:
      "Les données du système de suivi des navires par satellite (VMS) sont fournies par l'Institut costaricien des pêches et de l'aquaculture. Il est possible de suivre la position et l'activité de plus de 100 navires qui composent les flottes industrielles et internationales de pêche du Costa Rica.",
  },
  pt: {
    title: 'Rastreamento de embarcações da Costa Rica está disponível',
    description:
      'Os dados de rastreamento de embarcações de pesca são fornecidos pelo Instituto Costarriquenho de Pesca e Aquicultura. É possível visualizar a rota e as atividades de mais de 100 embarcações industriais e artesanais.',
  },
}

export default highlightPanelConfig
