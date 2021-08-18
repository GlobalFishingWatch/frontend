import { Locale } from 'types'

type HighlighPanelConfigLocale = {
  [locale in Locale]?: {
    title: string
    description: string
  }
}

export type HighlighPanelConfig = {
  dataviewInstanceId: string
  imageUrl: string
  learnMoreUrl: string
} & HighlighPanelConfigLocale

const highlightPanelConfig: HighlighPanelConfig = {
  dataviewInstanceId: 'fishing-vms',
  imageUrl: 'https://seatechaquariums.com/wp-content/uploads/2015/01/fish-facts-624x390.jpg',
  learnMoreUrl: 'http://www.globalfishingwatch.org',
  en: {
    title: 'Ecuador VMS now available!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
  },
  es: {
    title: 'Ecuador VMS ahora disponible',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip',
  },
}

export default highlightPanelConfig
