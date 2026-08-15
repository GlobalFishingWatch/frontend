import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'
import { DateTime } from 'luxon'
import { useGetDataUpdatesQuery } from 'queries/map/data-update-api'
import { useGetUseCasesQuery } from 'queries/map/use-case-api'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { Button } from '@globalfishingwatch/ui-components/button'
import type { CardProps } from '@globalfishingwatch/ui-components/card'
import { Card } from '@globalfishingwatch/ui-components/card'
import { ROUTE_PATHS } from '@platform/config/routes'

import type { HelpHubSectionId } from 'features/help/helpHub.content'
import { HELP_HUB_SECTIONS } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { getCardImage } from 'features/help/helpHub.utils'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'

import styles from './HelpHubLandingPage.module.css'

type SectionCards = {
  cards: (CardProps & { id: string; slug: string })[]
  isLoading: boolean
}

const LOADING_CARDS = 4

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
              <Button asChild type="secondary" className={styles.seeMore}>
                <Link to={ROUTE_PATHS.HELP_HUB_SECTION} params={{ sectionSlug: section.slug }}>
                  {t((s) => s.common.seeMore)}
                </Link>
              </Button>
            </div>
            {isLoading ? (
              <div className={styles.cardGrid}>
                {Array.from({ length: LOADING_CARDS }, (_, index) => (
                  <Card key={index} loading />
                ))}
              </div>
            ) : cards.length > 0 ? (
              <div className={styles.cardGrid}>
                {cards.map((card) => (
                  <Link
                    key={card.id}
                    to={ROUTE_PATHS.HELP_HUB_SECTION}
                    params={{ sectionSlug: section.slug, itemSlug: card.slug }}
                    className={styles.cardLink}
                  >
                    <Card title={item.title} image={getCardImage(item.thumbnail, item.body)}>
                      {item.publicationDate && (
                        <p className={styles.cardDate}>
                          {formatI18nDate(item.publicationDate, {
                            format: DateTime.DATE_FULL,
                          })}
                        </p>
                      )}
                    </Card>
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
