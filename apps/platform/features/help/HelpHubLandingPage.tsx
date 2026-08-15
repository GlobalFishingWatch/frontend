import { useTranslation } from 'react-i18next'
import { getRouteApi, Link } from '@tanstack/react-router'
import { DateTime } from 'luxon'

import { Button } from '@globalfishingwatch/ui-components/button'
import { Card } from '@globalfishingwatch/ui-components/card'
import { Carousel } from '@globalfishingwatch/ui-components/carousel'
import { ROUTE_PATHS } from '@platform/config/routes'

import { HELP_HUB_SECTIONS } from 'features/help/helpHub.content'
import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { getCardImage } from 'features/help/helpHub.utils'
import { formatI18nDate } from 'features/i18n/i18nDate.utils'

import styles from './HelpHubLandingPage.module.css'

const landingRoute = getRouteApi('/_platform/_content/help-and-resources/')

function HelpHubLandingPage() {
  const { t } = useTranslation()
  const sectionItems = landingRoute.useLoaderData()

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>{t((s) => s.helpHub.title)}</h1>
      {HELP_HUB_SECTIONS.map((section) => {
        const { title, description } = getHelpHubSectionCopy(section.id)
        const items = sectionItems[section.id]
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
            {items.length > 0 ? (
              <Carousel id={`${section.slug}-carousel`} label={title}>
                {items.map((item) => (
                  <Link
                    key={item.id}
                    to={ROUTE_PATHS.HELP_HUB_SECTION}
                    params={{ sectionSlug: section.slug, itemSlug: item.slug }}
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
