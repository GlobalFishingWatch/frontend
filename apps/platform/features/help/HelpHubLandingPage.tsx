import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import Carousel from 'features/help/Carousel'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'

import styles from './HelpHubLandingPage.module.css'

function HelpHubLandingPage() {
  const { t } = useTranslation()

  return (
    <div className={styles.container}>
      {HELP_HUB_SECTIONS.map((section) => {
        const { title, description } = getHelpHubSectionCopy(section.id)
        return (
          <section key={section.slug} className={styles.section}>
            <h2 className={styles.title}>{title}</h2>
            <p className={styles.description}>{description}</p>
            <Link
              to={ROUTE_PATHS.HELP_HUB_SECTION}
              params={{ sectionSlug: section.slug }}
              className={styles.seeMore}
            >
              {t((s) => s.common.seeMore)}
            </Link>
            <Carousel id={`${section.slug}-carousel`}>{/* TODO section content cards */}</Carousel>
          </section>
        )
      })}
    </div>
  )
}

export default HelpHubLandingPage
