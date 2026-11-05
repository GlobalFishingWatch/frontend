import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'

import { ROUTE_PATHS } from '@platform/config/routes'

import type { BreadcrumbItem } from 'features/layouts/Breadcrumb'
import Breadcrumb from 'features/layouts/Breadcrumb'

import styles from './ApiTokens.module.css'

type ApiTokensHeaderProps = {
  title?: string
  description?: React.ReactNode
}

function ApiTokensHeader({ title, description }: ApiTokensHeaderProps) {
  const { t } = useTranslation()

  const items: BreadcrumbItem[] = [
    {
      id: ROUTE_PATHS.API_TOKENS,
      label: t((t) => t.apiTokens.title),
      ...(title && { link: { to: ROUTE_PATHS.API_TOKENS } }),
    },
  ]

  if (title) {
    items.push({ id: 'current', label: title })
  }

  return (
    <Fragment>
      <Breadcrumb items={items} className={styles.breadcrumb} />
      {description && <p className={styles.description}>{description}</p>}
    </Fragment>
  )
}

export default ApiTokensHeader
