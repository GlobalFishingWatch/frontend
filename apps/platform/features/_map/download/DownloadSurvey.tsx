import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { DownloadSurveyAnswer, DownloadSurveyLabels } from '@globalfishingwatch/ui-components'
import {
  DownloadSurvey as DownloadSurveyUI,
  submitDownloadSurvey,
} from '@globalfishingwatch/ui-components'

import { PATH_BASENAME } from 'data/map/config'
import {
  selectIsDownloadActivityFinished,
  selectIsDownloadActivityLoading,
} from 'features/_map/download/downloadActivity.slice'
import ActivityDownloadError from 'features/_map/download/DownloadActivityError'
import { selectUserGroupsClean } from 'features/_user/selectors/user.permissions.selectors'
import { selectUserData } from 'features/_user/selectors/user.selectors'

export const DISABLE_DOWNLOAD_SURVEY = 'disableDownloadSurvey'

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
    (answer: DownloadSurveyAnswer) =>
      submitDownloadSurvey({
        url: `${PATH_BASENAME}/api/downloadSurvey`,
        answer,
        user: userData,
        groups: userGroups,
      }),
    [userData, userGroups]
  )

  const onSent = useCallback(() => setSent(true), [])

  return (
    <DownloadSurveyUI
      disableStorageKey={DISABLE_DOWNLOAD_SURVEY}
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
