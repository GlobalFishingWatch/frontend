import { useTranslation } from 'react-i18next'
import { useParams } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { getHelpHubSectionCopy } from 'features/help/helpHub.i18n'
import { findHelpHubSection } from 'features/help/helpHub.utils'
import type { BreadcrumbItem } from 'features/layouts/Breadcrumb'
import Breadcrumb from 'features/layouts/Breadcrumb'

import styles from './HelpHubBreadcrumb.module.css'

function HelpHubBreadcrumb() {
  const { t } = useTranslation()
  const { sectionSlug } = useParams({ strict: false })
  const section = sectionSlug ? findHelpHubSection(sectionSlug) : undefined

  const items: BreadcrumbItem[] = [
    {
      id: ROUTE_PATHS.HELP_HUB,
      label: t((s) => s.helpHub.title),
      ...(section && { link: { to: ROUTE_PATHS.HELP_HUB } }),
    },
  ]
  if (section) {
    items.push({ id: section.slug, label: getHelpHubSectionCopy(section.id).title })
  }

  return <Breadcrumb items={items} className={styles.container} />
}

export default HelpHubBreadcrumb
