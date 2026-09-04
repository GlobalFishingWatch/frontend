import type { useTranslation } from 'react-i18next'

import { PATH_BASENAME } from 'data/map/config'

type TFunc = ReturnType<typeof useTranslation>['t']

export type OnboardingCardId = 'searchVessel' | 'areaReport' | 'userGuide'

export type OnboardingCard = {
  id: OnboardingCardId
  title: string
  description: string
  image: string
}

/** Rotated through the copilot input as an animated placeholder. */
export function getCopilotExamples(t: TFunc): string[] {
  return [
    t((t) => t.onboarding.copilotExamples.squidPacific),
    t((t) => t.onboarding.copilotExamples.galapagosEffort),
    t((t) => t.onboarding.copilotExamples.carrierEncounters),
    t((t) => t.onboarding.copilotExamples.lasPalmasVisits),
    t((t) => t.onboarding.copilotExamples.trackVessel),
    t((t) => t.onboarding.copilotExamples.northSeaTrawling),
    t((t) => t.onboarding.copilotExamples.loiteringWestAfrica),
    t((t) => t.onboarding.copilotExamples.peruEffort),
    t((t) => t.onboarding.copilotExamples.nightLightYellowSea),
    t((t) => t.onboarding.copilotExamples.senegalPortVisits),
  ]
}

export function getOnboardingCards(t: TFunc): OnboardingCard[] {
  return [
    {
      id: 'searchVessel',
      title: t((t) => t.onboarding.searchVessel.title),
      description: t((t) => t.onboarding.searchVessel.description),
      image: `${PATH_BASENAME}/images/welcome-panel/vessel-search.jpg`,
    },
    {
      id: 'areaReport',
      title: t((t) => t.onboarding.areaReport.title),
      description: t((t) => t.onboarding.areaReport.description),
      image: `${PATH_BASENAME}/images/welcome-panel/area-report.jpg`,
    },
    {
      id: 'userGuide',
      title: t((t) => t.onboarding.userGuide.title),
      description: t((t) => t.onboarding.userGuide.description),
      image: `${PATH_BASENAME}/images/welcome-panel/user-guide.jpg`,
    },
  ]
}
