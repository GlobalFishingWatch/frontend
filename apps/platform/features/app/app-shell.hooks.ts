import { useFeatureFlagsToast } from 'features/debug/debug.hooks'
import { useUserLanguageUpdate } from 'features/i18n/i18n.hooks'
import { useActivityDownloadTimeoutRefresh } from 'features/map/download/downloadActivity.hooks'
import { useEnsureWorkspaceLoad } from 'features/map/workspace/workspace-load.hook'
import { useLoginPopupListener } from 'features/user/user.hooks'
import { useFetchTrackCorrections } from 'features/vessels/track-correction/track-correction.hooks'
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
