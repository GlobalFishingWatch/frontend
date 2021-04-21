/* global window */
import React, { Fragment } from 'react'
import useGFWLogin from '@globalfishingwatch/react-hooks/dist/use-login'
import GFWAPI from '@globalfishingwatch/api-client'

export default function Login({ children }: any) {
  const { logged, loading } = useGFWLogin()
  if (logged === false && loading === false) {
    window.location.href = GFWAPI.getLoginUrl(window.location.toString())
  }
  if (!logged) return null
  return <Fragment>{children}</Fragment>
}
