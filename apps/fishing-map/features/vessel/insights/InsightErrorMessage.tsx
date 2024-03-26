import { useTranslation } from 'react-i18next'
import { InsightErrorResponse } from '@globalfishingwatch/api-types'
import { Icon } from '@globalfishingwatch/ui-components'

const InsightError = ({ error }: { error: InsightErrorResponse }) => {
  const { t } = useTranslation()
  if (error.status === 401) {
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
}

export default InsightError
