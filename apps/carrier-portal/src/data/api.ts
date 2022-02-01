import { Dispatch } from 'redux'
import { NavigationAction } from 'redux-first-router'
import { GFWAPI } from '@globalfishingwatch/api-client'
import { AppActions } from 'redux-modules/actions'
import { userLogout } from 'redux-modules/user/user.actions'

export const DATASET_ID = process.env.REACT_APP_DATASET_ID || 'carriers:latest'

export const API_GATEWAY_URL = process.env.REACT_APP_API_GATEWAY

export const fetchAPI = async <T = any>(
  url: string,
  dispatch: Dispatch<AppActions | NavigationAction>,
  options: any = { json: true }
) => {
  try {
    const response = await GFWAPI.fetch<T>(url, options)
    return response
  } catch (error) {
    if (dispatch) {
      if (error.status > 400 && error.status < 403) {
        dispatch(userLogout())
      }
    }
  }
}

export const fetchLocalAPI = async <T>(
  url: string,
  options: any = { json: true, headers: {} }
): Promise<T> => {
  try {
    const fetchOptions = {
      ...options,
      headers: {
        ...options.headers,
        'x-gateway-url': 'http://gateway.api.dev.globalfishingwatch.org',
        user: JSON.stringify({ id: 45, type: 'user', email: process.env.REACT_APP_LOCAL_API_USER }),
      },
    }
    const response = await fetch(url, fetchOptions)
    return options.json ? await response.json() : response
  } catch (error) {
    console.warn(error)
    throw new Error(error)
  }
}
