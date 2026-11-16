import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

import { ROUTE_PATHS } from '@platform/config/routes'

import { formatI18nDate } from 'features/i18n/i18nDate.utils'

import { useApiTokens } from './api-tokens.hooks'

import styles from './ApiTokenList.module.css'

function ApiTokenList() {
  const { t } = useTranslation()
  const entries = useApiTokens()

  if (!entries?.length) {
    return (
      <div className={styles.placeholder}>
        {entries ? t((t) => t.apiTokens.noTokens) : t((t) => t.errors.genericShort)}
      </div>
    )
  }

  return (
    <table className={styles.list}>
      <thead>
        <tr>
          <th>{t((t) => t.apiTokens.applicationName)}</th>
          <th>{t((t) => t.apiTokens.description)}</th>
          <th>{t((t) => t.apiTokens.creationDate)}</th>
        </tr>
      </thead>
      <tbody>
        {entries.map(({ id, name, description, createdAt }) => (
          <tr key={id} className={styles.row}>
            <td>
              <Link
                to={ROUTE_PATHS.API_TOKEN}
                params={{ tokenId: String(id) }}
                className={styles.name}
              >
                {name}
              </Link>
            </td>
            <td className={styles.secondary}>{description}</td>
            <td className={styles.secondary}>{formatI18nDate(createdAt)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default ApiTokenList
