import type { useTranslation } from 'react-i18next'

import type { IconType } from '@globalfishingwatch/ui-components/icon'

import { PATH_BASENAME } from 'data/map/config'

type TFunc = ReturnType<typeof useTranslation>['t']

export type WelcomeCardId = 'searchVessel' | 'areaReport' | 'userGuide' | 'assistant'

export type WelcomeCard = {
  id: WelcomeCardId
  icon: IconType
  title: string
  description: string
  image?: string
}

export function getWelcomeCards(t: TFunc): WelcomeCard[] {
  return [
    {
      id: 'searchVessel',
      icon: 'vessel-section',
      title: t((t) => t.onboarding.searchVessel.title),
      description: t((t) => t.onboarding.searchVessel.description),
      image: `${PATH_BASENAME}/images/welcome-panel/vessel-search.jpg`,
    },
    {
      id: 'areaReport',
      icon: 'areas',
      title: t((t) => t.onboarding.areaReport.title),
      description: t((t) => t.onboarding.areaReport.description),
      image: `${PATH_BASENAME}/images/welcome-panel/area-report.jpg`,
    },
    {
      id: 'userGuide',
      icon: 'help',
      title: t((t) => t.onboarding.userGuide.title),
      description: t((t) => t.onboarding.userGuide.description),
      image: `${PATH_BASENAME}/images/welcome-panel/user-guide.jpg`,
    },
    {
      id: 'assistant' as const,
      icon: 'magic' as IconType,
      title: t((t) => t.onboarding.assistant.title),
      description: t((t) => t.onboarding.assistant.description),
      image: `${PATH_BASENAME}/images/welcome-panel/chat.jpg`,
    },
  ]
}
