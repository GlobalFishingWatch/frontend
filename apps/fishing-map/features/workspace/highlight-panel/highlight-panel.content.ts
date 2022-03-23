import { PATH_BASENAME } from 'routes/routes'
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
  dataviewInstanceId: 'highlight-vms-with-belize',
  // TBD
  imageUrl: `${PATH_BASENAME}/images/costa-rica-vms.jpg`,
  // TBD
  learnMoreUrl: 'https://globalfishingwatch.org/belize',
  en: {
    title: 'Belize VMS data is now available',
    description:
      'Vessel monitoring system (VMS) data is provided by the Belize High Seas Fisheries Unit (BHSFU). It is possible to track the position and activity of 50+ vessels comprising Belize’s international fishing fleets.',
  },
  es: {
    title: 'Los datos de VMS de Belize ya están disponibles',
    description:
      'Los datos del sistema de seguimiento de embarcaciones (VMS) son proporcionados por la Unidad de Pesca de Alta Mar de Belice (BHSFU, por sus siglas en inglés). Es posible rastrear la posición y actividad de más de 50 embarcaciones que comprenden las flotas pesqueras internacionales de Belice.',
    // TBD
    learnMoreUrl: 'https://globalfishingwatch.org/es/belize',
  },
  fr: {
    title: 'Les données VMS du Bélize sont maintenant disponibles',
    description:
      "Les données du système de suivi des navires par satellite (VMS) sont fournies par XXX. Il est possible de suivre la position et l'activité de plus de 100 navires qui composent les flottes industrielles et internationales de pêche du Bélize.",
    // TBD
    learnMoreUrl: 'https://globalfishingwatch.org/fr/belize',
  },
  pt: {
    title: 'Rastreamento de embarcações da Belice está disponível',
    description:
      'Os dados de rastreamento de embarcações de pesca são fornecidos pelo XXX. É possível visualizar a rota e as atividades de mais de 50 embarcações industriais e artesanais.',
    // TBD
    learnMoreUrl: 'https://globalfishingwatch.org/pt/belize',
  },
}

export default highlightPanelConfig
