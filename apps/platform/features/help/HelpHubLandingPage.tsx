import { useTranslation } from 'react-i18next'

import Carousel from 'features/help/Carousel'

import styles from './HelpHubLandingPage.module.css'

const HELP_HUB_SECTIONS = [
  { id: 'toolsAndFeatures', slug: 'tools-and-features' },
  { id: 'useCases', slug: 'use-cases' },
  { id: 'platformAndUpdates', slug: 'platform-and-updates' },
] as const

function HelpHubLandingPage() {
  const { t } = useTranslation()

  // Resolved on every render so the copy follows language changes, and kept as
  // literal selectors so i18next-cli can extract the keys statically.
  const sectionCopy = {
    toolsAndFeatures: {
      title: t((s) => s.helpHub.sections.toolsAndFeatures.title),
      description: t((s) => s.helpHub.sections.toolsAndFeatures.description),
    },
    useCases: {
      title: t((s) => s.helpHub.sections.useCases.title),
      description: t((s) => s.helpHub.sections.useCases.description),
    },
    platformAndUpdates: {
      title: t((s) => s.helpHub.sections.platformAndUpdates.title),
      description: t((s) => s.helpHub.sections.platformAndUpdates.description),
    },
  }

  return (
    <div className={styles.container}>
      {HELP_HUB_SECTIONS.map((section) => (
        <section key={section.slug} id={section.slug} className={styles.section}>
          <h2 className={styles.title}>{sectionCopy[section.id].title}</h2>
          <p className={styles.description}>{sectionCopy[section.id].description}</p>
          {/* TODO point this at the section route once it exists, using TanStack's Link */}
          <a href={`#${section.slug}`} className={styles.seeMore}>
            {t((s) => s.common.seeMore)}
          </a>
          <Carousel id={`${section.slug}-carousel`}>{/* TODO section content cards */}</Carousel>
        </section>
      ))}
    </div>
  )
}

export default HelpHubLandingPage
