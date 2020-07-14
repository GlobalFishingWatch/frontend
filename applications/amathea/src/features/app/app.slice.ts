import { createSlice, createSelector } from '@reduxjs/toolkit'
import { RootState } from 'store'

interface AppState {
  menuOpen: boolean
  sidebarOpen: boolean
}

const initialState: AppState = {
  menuOpen: false,
  sidebarOpen: true,
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    toggleMenu: (state) => {
      state.menuOpen = !state.menuOpen
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
  },
})

const { toggleMenu, toggleSidebar } = appSlice.actions

export { toggleMenu, toggleSidebar }

export const selectMenuOpen = (state: RootState) => state.app.menuOpen
export const selectSidebarOpen = (state: RootState) => state.app.sidebarOpen

export const isMenuOpen = createSelector([selectMenuOpen], (menuOpen) => menuOpen)
export const isSidebarOpen = createSelector([selectSidebarOpen], (sidebarOpen) => sidebarOpen)

export default appSlice.reducer
