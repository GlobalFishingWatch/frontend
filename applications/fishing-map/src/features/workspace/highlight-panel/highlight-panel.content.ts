import { Locale } from 'types'

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
  dataviewInstanceId: 'highlight-vms-with-brazil',
  imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/workspace-brazil.jpg',
  learnMoreUrl: 'https://globalfishingwatch.org/brazil',
  en: {
    title: 'Brazil VMS data is now available',
    description:
      'Vessel monitoring system (VMS) data is provided by the Brazilian Secretary of Aquaculture and Fisheries. It is possible to track the position and activity of 1,300+ vessels comprising Brazil’s industrial and artisanal fishing fleets.',
  },
  es: {
    title: 'Datos VMS de Brasil están ahora disponibles',
    description:
      'Los datos del sistema de seguimiento de buques (VMS) son proporcionados por el Secretario de Acuicultura y Pesca de Brasil. Es posible rastrear la posición y actividad de más de 1300 embarcaciones que comprenden las flotas pesqueras industriales y artesanales de Brasil.',
    learnMoreUrl: 'https://globalfishingwatch.org/es/brazil',
  },
  pt: {
    title: 'Rastreamento de embarcações brasileiras está disponível',
    description:
      'Os dados de rastreamento de embarcações de pesca são fornecidos pela Secretaria de Aquicultura e Pesca do Ministério da Agricultura, Pecuária e Abastecimento. É possível visualizar a rota e as atividades de mais de 1300 embarcações industriais e artesanais.',
  },
}

export default highlightPanelConfig
