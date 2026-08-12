import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { useGetDataUpdatesQuery } from 'queries/map/data-update-api'
import { useGetUseCasesQuery } from 'queries/map/use-case-api'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { Card } from '@globalfishingwatch/ui-components/card'
import { Carousel } from '@globalfishingwatch/ui-components/carousel'
import { ROUTE_PATHS } from '@platform/config/routes'

import type { HelpHubSectionId } from 'features/help/helpHub.content'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import type { HelpHubCard } from 'features/help/helpHub.types'
import { toDataUpdateCards, toUseCaseCards, toUserGuideCards } from 'features/help/helpHub.types'

import styles from './HelpHubLandingPage.module.css'

type SectionCards = { cards: HelpHubCard[]; isLoading: boolean }

function HelpHubLandingPage() {
  const { t, i18n } = useTranslation()
  const locale = i18n.language as Locale

  const { data: userGuide = [], isLoading: isLoadingUserGuide } = useGetUserGuideQuery({ locale })
  const { data: useCases = [], isLoading: isLoadingUseCases } = useGetUseCasesQuery({ locale })
  const { data: dataUpdates = [], isLoading: isLoadingDataUpdates } = useGetDataUpdatesQuery({
    locale,
  })

  const sectionCards = useMemo<Record<HelpHubSectionId, SectionCards>>(
    () => ({
      toolsAndFeatures: { cards: toUserGuideCards(userGuide), isLoading: isLoadingUserGuide },
      useCases: { cards: toUseCaseCards(useCases), isLoading: isLoadingUseCases },
      platformAndUpdates: {
        cards: toDataUpdateCards(dataUpdates),
        isLoading: isLoadingDataUpdates,
      },
    }),
    [userGuide, useCases, dataUpdates, isLoadingUserGuide, isLoadingUseCases, isLoadingDataUpdates]
  )

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t((s) => s.helpHub.title)}</h1>
      {HELP_HUB_SECTIONS.map((section) => {
        const { title, description } = getHelpHubSectionCopy(section.id)
        const { cards, isLoading } = sectionCards[section.id]
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
            {isLoading ? (
              <div className={styles.carouselPlaceholder}>
                <Spinner size="small" />
              </div>
            ) : cards.length > 0 ? (
              <Carousel id={`${section.slug}-carousel`} label={title}>
                {cards.map((card) => (
                  <Card
                    key={card.id}
                    title={card.title}
                    subtitle={card.subtitle}
                    image={card.image}
                    titleTag="h3"
                  />
                ))}
              </Carousel>
            ) : (
              <p className={styles.carouselPlaceholder}>{t((s) => s.common.noData)}</p>
            )}
          </section>
        )
      })}
    </div>
  )
}

export default HelpHubLandingPage
