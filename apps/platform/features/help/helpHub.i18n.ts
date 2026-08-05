import { t } from 'features/i18n/i18n'

import type { HelpHubSectionId } from './helpHub.content'

export function getHelpHubSectionCopy(id: HelpHubSectionId): {
  title: string
  description: string
} {
  switch (id) {
    case 'toolsAndFeatures':
      return {
        title: t((s) => s.helpHub.sections.toolsAndFeatures.title),
        description: t((s) => s.helpHub.sections.toolsAndFeatures.description),
      }
    case 'useCases':
      return {
        title: t((s) => s.helpHub.sections.useCases.title),
        description: t((s) => s.helpHub.sections.useCases.description),
      }
    case 'platformAndUpdates':
      return {
        title: t((s) => s.helpHub.sections.platformAndUpdates.title),
        description: t((s) => s.helpHub.sections.platformAndUpdates.description),
      }
  }
}
