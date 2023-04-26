import { useSelector } from 'react-redux'
import { useCallback, useEffect, useRef } from 'react'
import { parse } from 'qs'
import { useRouter } from 'next/router'
import { history } from 'redux-first-router'
import { ACCESS_TOKEN_STRING } from '@globalfishingwatch/api-client'
import { parseWorkspace } from '@globalfishingwatch/dataviews-client'
import { DEFAULT_CALLBACK_URL_PARAM, useLoginRedirect } from '@globalfishingwatch/react-hooks'
import { QueryParams } from 'types'
import {
  selectCurrentLocation,
  selectIsVesselDetailLocation,
  selectLocationPayload,
  selectLocationType,
} from 'routes/routes.selectors'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectCurrentWorkspaceCategory,
  selectCurrentWorkspaceId,
} from 'features/workspace/workspace.selectors'
import { DEFAULT_WORKSPACE_ID, WorkspaceCategory } from 'data/workspaces'
import { HOME, ROUTE_TYPES, VESSEL } from './routes'
import { updateLocation } from './routes.actions'

export const useNextAndRFRSync = () => {
  const router = useRouter()
  console.log('🚀 ~ useNextAndRFRSync ~ router:', router)
  const {
    category = WorkspaceCategory.FishingActivity,
    workspace = DEFAULT_WORKSPACE_ID,
    datasetId = '',
    vesselId = '',
  } = router.query
  const { dispatchLocation } = useLocationConnect()
  const location = useSelector(selectLocationType)

  const checkUrlUnsync = (url) => {
    if (url.includes('/vessel/') && location !== VESSEL) {
      console.log('should dispatch vessel location?')
      // updateReportLocation()
    }
  }
  const updateReportLocation = useCallback(() => {
    dispatchLocation(
      VESSEL,
      {
        payload: {
          category,
          workspaceId: workspace,
          datasetId: 'public-global-all-vessels:v20201001',
          vesselId: 'c07d01962-2339-d970-f490-352e951532af',
        },
      },
      { replaceUrl: true }
    )
    router.events.off('routeChangeComplete', checkUrlUnsync)
  }, [dispatchLocation])

  useEffect(() => {
    router.events.on('routeChangeComplete', checkUrlUnsync)
    window.addEventListener('popstate', (event) => {
      console.log('popstate change')
      console.log(`location: ${document.location}, state: ${JSON.stringify(event.state)}`)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      router.events.off('routeChangeComplete', checkUrlUnsync)
    }
  }, [])
}

export const useReplaceLoginUrl = () => {
  const { redirectUrl, cleanRedirectUrl } = useLoginRedirect()
  const dispatch = useAppDispatch()
  const locationPayload = useSelector(selectLocationPayload)
  const locationType = useSelector(selectLocationType)

  useEffect(() => {
    const currentQuery = parse(window.location.search, { ignoreQueryPrefix: true })
    const hasCallbackUrlStorageQuery = currentQuery[DEFAULT_CALLBACK_URL_PARAM]
    const accessToken = currentQuery[ACCESS_TOKEN_STRING]
    if (redirectUrl && hasCallbackUrlStorageQuery) {
      const query = {
        ...parseWorkspace(new URL(redirectUrl).search),
        [ACCESS_TOKEN_STRING]: accessToken,
        [DEFAULT_CALLBACK_URL_PARAM]: undefined,
      } as QueryParams

      dispatch(
        updateLocation(locationType, {
          query,
          payload: locationPayload,
          replaceQuery: true,
        })
      )
      cleanRedirectUrl()
    }
    return () => {
      // ensures the localStorage is clean when the app is unmounted
      cleanRedirectUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const useLocationConnect = () => {
  const dispatch = useAppDispatch()
  const location = useSelector(selectCurrentLocation)
  const payload = useSelector(selectLocationPayload)

  const dispatchLocation = useCallback(
    (
      type: ROUTE_TYPES,
      params = {} as { query?: QueryParams; payload?: Record<string, any> },
      { replaceQuery = false, replaceUrl = false } = {}
    ) => {
      const { query = {}, payload: customPayload = {} } = params
      dispatch(
        updateLocation(type, {
          query,
          payload: { ...payload, ...customPayload },
          replaceQuery,
          replaceUrl,
        })
      )
    },
    [dispatch, payload]
  )

  const dispatchQueryParams = useCallback(
    (query: QueryParams, replaceQuery = false) => {
      dispatch(updateLocation(location.type, { query, payload, replaceQuery }))
    },
    [dispatch, location.type, payload]
  )

  return { location, payload, dispatchLocation, dispatchQueryParams }
}
