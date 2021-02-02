import { createAsyncThunk } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client'

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async ({ redirectToLogin }: { redirectToLogin: boolean } = { redirectToLogin: false }) => {
    try {
      await GFWAPI.logout()
    } catch (e) {
      console.warn(e)
    }
    if (redirectToLogin) {
      window.location.href = GFWAPI.getLoginUrl(window.location.toString())
    }
  }
)
