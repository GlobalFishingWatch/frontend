import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { useGetDataUpdatesQuery } from 'queries/map/data-update-api'
import { useGetUseCasesQuery } from 'queries/map/use-case-api'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { Card } from '@globalfishingwatch/ui-components/card'
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
      toolsAndFeatures: {
        cards: userGuide.map(({ id, slug, title, thumbnail, body }) => ({
          id,
          slug,
          title,
          image: getCardImage(thumbnail, body),
        })),
        isLoading: isLoadingUserGuide,
      },
      useCases: {
        cards: useCases.map(({ id, slug, role, thumbnail, body }) => ({
          id,
          slug,
          title: role,
          image: getCardImage(thumbnail, body),
        })),
        isLoading: isLoadingUseCases,
      },
      platformAndUpdates: {
        cards: dataUpdates.map(({ id, slug, title, thumbnail, body, publication_date }) => ({
          id,
          slug,
          title,
          subtitle: publication_date
            ? formatI18nDate(publication_date, { format: DateTime.DATE_FULL })
            : undefined,
          image: getCardImage(thumbnail, body),
        })),
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
              <div className={styles.cardGrid}>
                {cards.map((card) => (
                  <Link
                    key={card.id}
                    to={ROUTE_PATHS.HELP_HUB_SECTION}
                    params={{ sectionSlug: section.slug, topicSlug: card.slug }}
                    className={styles.cardLink}
                  >
                    <Card
                      title={card.title}
                      subtitle={card.subtitle}
                      image={card.image}
                      titleTag="h3"
                    />
                  </Link>
                ))}
              </div>
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
