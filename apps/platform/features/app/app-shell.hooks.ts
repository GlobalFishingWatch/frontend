import { useActivityDownloadTimeoutRefresh } from 'features/_map/download/downloadActivity.hooks'
import { useEnsureWorkspaceLoad } from 'features/_map/workspace/workspace-load.hook'
import { useLoginPopupListener } from 'features/_user/user.hooks'
import { useFetchTrackCorrections } from 'features/_vessels/track-correction/track-correction.hooks'
import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import { useBeforeUnload } from 'router/routes.hook'

import { useAnalytics } from './analytics.hooks'

/**
 * App-wide side effects, shared by every shell that mounts the Redux Provider.
 *
 * `useEnsureWorkspaceLoad` is required even in shells with no map: ROUTES_WITH_DEFAULT_WORKSPACE in
 * router/routes.ts includes USER and SEARCH, so those routes still need a default workspace loaded.
 */
export function useAppShell() {
  useAnalytics()
  useBeforeUnload()
  useUserLanguageUpdate()
  useFeatureFlagsToast()
  useFetchTrackCorrections()
  useActivityDownloadTimeoutRefresh()
  useEnsureWorkspaceLoad()
  useLoginPopupListener()
}
