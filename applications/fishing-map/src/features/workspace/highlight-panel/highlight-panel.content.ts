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
  dataviewInstanceId: 'highlight-vms-with-ecuador',
  imageUrl: 'https://globalfishingwatch.org/wp-content/uploads/ecuador-map-highlight@2x.jpg',
  learnMoreUrl: 'https://globalfishingwatch.org/transparency-program-ecuador/',
  en: {
    title: 'Ecuador VMS data is now available',
    description:
      'The vessel monitoring system (VMS) data is provided by the National Directorate of Aquatic Spaces of Ecuador. It is possible to track the position and activity of 1,200+ vessels comprising Ecuador’s industrial and artisanal fishing fleets.',
  },
  es: {
    title: 'Datos VMS de Ecuador están ahora disponibles',
    description:
      'Los datos del sistema de monitoreo de embarcaciones (VMS) son proporcionados por la Dirección Nacional de los Espacios Acuáticos del Ecuador. Es posible rastrear la posición y actividad  de más de 1.200 embarcaciones de las flotas pesqueras industriales y artesanales de Ecuador.',
    learnMoreUrl: 'https://globalfishingwatch.org/es/transparency-program-ecuador/es',
  },
}

export default highlightPanelConfig
