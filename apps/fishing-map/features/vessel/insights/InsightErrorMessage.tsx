import { useTranslation } from 'react-i18next'

import type { ParsedAPIError } from '@globalfishingwatch/api-client'
import { Icon } from '@globalfishingwatch/ui-components'

import { EMPTY_FIELD_PLACEHOLDER } from 'utils/info'

const InsightError = ({ error }: { error: ParsedAPIError }) => {
  const { t } = useTranslation()
  if (error.status === 403) {
    return (
      <Icon
        icon="private"
        tooltip={t(
          'vessel.insights.errorPermisions',
          "You don't have permissions to see this insight"
        )}
      />
    )
  }
  return EMPTY_FIELD_PLACEHOLDER
}

export default InsightError
