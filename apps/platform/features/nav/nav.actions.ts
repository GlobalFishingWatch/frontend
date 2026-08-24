import { createAction } from '@reduxjs/toolkit'

/**
 * Nav events that slices react to, rather than the nav reaching into each slice.
 *
 * MainNav is rendered by PlatformLayout on every route, so importing five slices just to dispatch their
 * reset actions put all five in the always-loaded graph. Dispatching one action from here and reacting in
 * each slice's `extraReducers` inverts that — the same pattern user.slice.ts already documents for logout
 * cleanup reacting to `logoutUserThunk`.
 *
 * This module must stay dependency-free apart from RTK.
 */
export const workspaceTabClicked = createAction('nav/workspaceTabClicked')
