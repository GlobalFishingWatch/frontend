import { useActivityDownloadTimeoutRefresh } from 'features/_map/download/downloadActivity.hooks'
import { useEnsureWorkspaceLoad } from 'features/_map/workspace/workspace-load.hook'
import { useLoginPopupListener, useSettingsMessageListener } from 'features/_user/user.hooks'
import { useFetchTrackCorrections } from 'features/_vessels/track-correction/track-correction.hooks'
import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import { useBeforeUnload } from 'router/routes.hook'

import { useAnalytics } from './analytics.hooks'

export function useAppShell() {
  useAnalytics()
  useBeforeUnload()
  useUserLanguageUpdate()
  useFeatureFlagsToast()
  useFetchTrackCorrections()
  useActivityDownloadTimeoutRefresh()
  useEnsureWorkspaceLoad()
  useLoginPopupListener()
  useSettingsMessageListener()
}
