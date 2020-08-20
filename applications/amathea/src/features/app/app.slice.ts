import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'store'
import { ModalTypes } from 'types'

interface AppState {
  menuOpen: boolean
  sidebarOpen: boolean
  modalOpen: ModalTypes | false
}

const initialState: AppState = {
  menuOpen: false,
  sidebarOpen: true,
  modalOpen: false,
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
    setModalOpen: (state, action: PayloadAction<ModalTypes | false>) => {
      state.modalOpen = action.payload
    },
  },
})

export const { toggleMenu, toggleSidebar, setModalOpen } = appSlice.actions

export const selectMenuOpen = (state: RootState) => state.app.menuOpen
export const selectSidebarOpen = (state: RootState) => state.app.sidebarOpen

export const isMenuOpen = createSelector([selectMenuOpen], (menuOpen) => menuOpen)
export const isSidebarOpen = createSelector([selectSidebarOpen], (sidebarOpen) => sidebarOpen)
export const selectModalOpen = createSelector(
  [(state: RootState) => state.app.modalOpen],
  (modalOpen) => modalOpen
)

export default appSlice.reducer
