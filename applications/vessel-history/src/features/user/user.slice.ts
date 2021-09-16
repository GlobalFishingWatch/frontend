import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'
import { RootState } from 'store'

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ redirectTo }: { redirectTo?: 'gfw-login' | 'home' } = { redirectTo: undefined }) => {
    try {
      await GFWAPI.logout()
    } catch (e: any) {
      console.warn(e)
    }
    if (redirectTo === 'gfw-login') {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
    if (redirectTo === 'home') {
      window.location.href = window.location.toString()
    }
  }
)
