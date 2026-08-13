import { t } from 'features/i18n/i18n'

import type { HelpHubSectionId } from './helpHub.content'

export function getHelpHubSectionCopy(id: HelpHubSectionId): {
  title: string
  description: string
} {
  return {
    title: t((t) => t.helpHub[id].title),
    description: t((t) => t.helpHub[id].description),
  }
}
