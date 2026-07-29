import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { DownloadSurveyAnswer, DownloadSurveyLabels } from '@globalfishingwatch/ui-components'
import { DownloadSurvey as DownloadSurveyUI } from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/config'
import {
  selectIsDownloadActivityFinished,
  selectIsDownloadActivityLoading,
} from 'features/download/downloadActivity.slice'
import ActivityDownloadError from 'features/download/DownloadActivityError'
import { selectUserGroupsClean } from 'features/user/selectors/user.permissions.selectors'
import { selectUserData } from 'features/user/selectors/user.selectors'
import type { FeedbackFormData } from 'routes/api/downloadSurvey'

export { DISABLE_DOWNLOAD_SURVEY } from '@globalfishingwatch/ui-components'

function DownloadSurvey({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation()
  const isDownloadLoading = useSelector(selectIsDownloadActivityLoading)
  const isDownloadFinished = useSelector(selectIsDownloadActivityFinished)
  const userData = useSelector(selectUserData)
  const userGroups = useSelector(selectUserGroupsClean)
  const [sent, setSent] = useState(false)

  const labels: Partial<DownloadSurveyLabels> = useMemo(
    () => ({
      title: t((t) => t.download.survey.title),
      description: t((t) => t.download.survey.description),
      intentLabel: t((t) => t.download.survey.intentLabel),
      intentPlaceholder: t((t) => t.download.survey.intentPlaceholder),
      contactPermissionLabel: t((t) => t.download.survey.contactPermissionLabel),
      contactPermissionYes: t((t) => t.download.survey.contactPermissionYes),
      contactPermissionNo: t((t) => t.download.survey.contactPermissionNo),
      sent: t((t) => t.download.survey.sent),
      error: t((t) => t.download.survey.error),
      disable: t((t) => t.common.welcomePopupDisable),
      skip: t((t) => t.common.skip),
      send: t((t) => t.common.sendFeedback),
      downloading: t((t) => t.download.downloading),
    }),
    [t]
  )

  useEffect(() => {
    if (sent && isDownloadFinished) {
      onClose()
    }
  }, [sent, isDownloadFinished, onClose])

  const onConfirm = useCallback(
    async ({ usageIntent, contactConsent }: DownloadSurveyAnswer) => {
      const { firstName, lastName, email, organization, organizationType, organizationCategory } =
        userData || {}
      const surveyAnswer: FeedbackFormData = {
        date: new Date().toISOString(),
        name: `${firstName} ${lastName}`,
        email: email as string,
        groups: (userGroups || []).join(', '),
        organization: organization || '',
        organizationCategory: organizationCategory || '',
        organizationType: organizationType || '',
        usageIntent,
        contactConsent,
      }
      const response = await fetch(`${PATH_BASENAME}/api/downloadSurvey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyAnswer),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong')
      }
    },
    [userData, userGroups]
  )

  const onSent = useCallback(() => {
    setSent(true)
    if (isDownloadFinished) {
      onClose()
    }
  }, [isDownloadFinished, onClose])

  return (
    <DownloadSurveyUI
      labels={labels}
      downloading={isDownloadLoading}
      onConfirm={onConfirm}
      onSent={onSent}
      onClose={onClose}
      footerSlot={sent ? <ActivityDownloadError /> : undefined}
    />
  )
}

export default DownloadSurvey
