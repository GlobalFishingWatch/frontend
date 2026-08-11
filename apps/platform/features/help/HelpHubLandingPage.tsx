import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

import { Card } from '@globalfishingwatch/ui-components/card'
import { Carousel } from '@globalfishingwatch/ui-components/carousel'
import { ROUTE_PATHS } from '@platform/config/routes'

import { HELP_HUB_SECTIONS, type HelpHubSectionId } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'

import styles from './HelpHubLandingPage.module.css'

const PLACEHOLDER_CARDS: Record<HelpHubSectionId, { id: string; title: string; date?: string }[]> =
  {
    toolsAndFeatures: [
      { id: 'a', title: 'Placeholder card' },
      { id: 'b', title: 'Placeholder card with a longer title' },
      { id: 'c', title: 'Placeholder card' },
      { id: 'd', title: 'Placeholder card with a much longer title that has to be truncated' },
    ],
    useCases: [
      { id: 'a', title: 'Placeholder card' },
      { id: 'b', title: 'Placeholder card with a longer title' },
      { id: 'c', title: 'Placeholder card' },
      { id: 'd', title: 'Placeholder card' },
    ],
    platformAndUpdates: [
      { id: 'a', title: 'Placeholder update', date: 'July 13, 2026' },
      { id: 'b', title: 'Placeholder update with a longer title', date: 'July 3, 2026' },
      { id: 'c', title: 'Placeholder update', date: 'June 3, 2026' },
      { id: 'd', title: 'Placeholder update with a much longer title', date: 'June 1, 2026' },
    ],
  }

function HelpHubLandingPage() {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t((s) => s.helpHub.title)}</h1>
      {HELP_HUB_SECTIONS.map((section) => {
        const { title, description } = getHelpHubSectionCopy(section.id)
        return (
          <section key={section.slug} className={styles.section}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.intro}>
              <p className={styles.description}>{description}</p>
              <Link
                to={ROUTE_PATHS.HELP_HUB_SECTION}
                params={{ sectionSlug: section.slug }}
                className={styles.seeMore}
              >
                {t((s) => s.common.seeMore)}
              </Link>
            </div>
            <Carousel id={`${section.slug}-carousel`} label={title}>
              {PLACEHOLDER_CARDS[section.id].map((card) => (
                <Card key={card.id} title={card.title} subtitle={card.date} titleTag="h3" />
              ))}
            </Carousel>
          </section>
        )
      })}
    </div>
  )
}

export default HelpHubLandingPage
