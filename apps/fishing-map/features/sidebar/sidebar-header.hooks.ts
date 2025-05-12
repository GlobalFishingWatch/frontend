import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'features/app/app.hooks'
import { selectVesselProfileDataviewIntance } from 'features/dataviews/selectors/dataviews.instances.selectors'
import { resetSidebarScroll } from 'features/sidebar/sidebar.utils'
import { resetVesselState } from 'features/vessel/vessel.slice'
import { updateLocation } from 'routes/routes.actions'
import type { LinkTo } from 'routes/routes.types'

export function usePinVesselProfileToWorkspace() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const vesselDataviewInstance = useSelector(selectVesselProfileDataviewIntance)

  const resetState = useCallback(() => {
    resetSidebarScroll()
    dispatch(resetVesselState())
  }, [dispatch])

  const onPinVesselToWorkspaceAndNavigateClick = useCallback(
    (linkTo: LinkTo) => {
      const { type, payload, query } = linkTo
      const params = { payload, query, isHistoryNavigation: true }
      if (
        vesselDataviewInstance &&
        window.confirm(
          t('vessel.confirmationClose', 'Do you want to keep this vessel in your workspace?')
        ) === true
      ) {
        const cleanVesselDataviewInstance = {
          ...vesselDataviewInstance,
          config: {
            ...vesselDataviewInstance?.config,
            highlightEventStartTime: undefined,
            highlightEventEndTime: undefined,
          },
        }
        params.query = {
          ...query,
          dataviewInstances: [
            ...(query.dataviewInstances || []),
            ...(cleanVesselDataviewInstance ? [cleanVesselDataviewInstance] : []),
          ],
        }
      }
      dispatch(updateLocation(type, params))
      resetState()
    },
    [dispatch, resetState, t, vesselDataviewInstance]
  )

  return onPinVesselToWorkspaceAndNavigateClick
}
