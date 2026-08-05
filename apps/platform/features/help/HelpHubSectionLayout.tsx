import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getRouteApi, Outlet, useNavigate, useParams } from '@tanstack/react-router'
import { useGetUserGuideQuery } from 'queries/map/user-guide-api'

import type { Locale } from '@globalfishingwatch/api-types'
import { Spinner } from '@globalfishingwatch/ui-components'
import { ROUTE_PATHS } from '@platform/config/routes'

import TableOfContents from 'features/_map/content-panel/user-guide/TableOfContents'
import { toHelpHubTopics } from 'features/help/helpHub.types'

import styles from './HelpHubSectionLayout.module.css'

const sectionRoute = getRouteApi('/_platform/_content/help-and-resources/$sectionSlug')

function HelpHubSectionLayout() {
  const { sectionSlug } = sectionRoute.useParams()
  const { topicSlug } = useParams({ strict: false })
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()

  const {
    data = [],
    isLoading,
    isError,
  } = useGetUserGuideQuery({
    locale: i18n.language as Locale,
  })

  const topics = useMemo(() => toHelpHubTopics(data), [data])

  if (isLoading) {
    return (
      <div className={styles.placeholder}>
        <Spinner />
      </div>
    )
  }

  if (isError || !topics.length) {
    return <p className={styles.placeholder}>{t((s) => s.common.noData)}</p>
  }

  return (
    <div className={styles.container}>
      <TableOfContents
        data={topics}
        activeId={topicSlug}
        className={styles.tableOfContents}
        onClick={(id) =>
          navigate({
            to: ROUTE_PATHS.HELP_HUB_TOPIC,
            params: { sectionSlug, topicSlug: id },
          })
        }
        onSubTopicClick={(sectionId, subId) =>
          navigate({
            to: ROUTE_PATHS.HELP_HUB_TOPIC,
            params: { sectionSlug, topicSlug: sectionId },
            hash: subId,
          })
        }
      />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}

export default HelpHubSectionLayout
