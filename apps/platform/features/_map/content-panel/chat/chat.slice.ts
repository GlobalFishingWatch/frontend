import type { PayloadAction, WithSlice } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { rootReducer } from 'reducers'

type ChatState = {
  /**
   * A question asked outside the chat (the onboarding modal), sent as soon as the session mounts.
   * Not persisted: a reload must not resend it.
   */
  pendingPrompt: string | null
}

const initialState: ChatState = {
  pendingPrompt: null,
}

const slice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setPendingChatPrompt: (state, action: PayloadAction<string | null>) => {
      state.pendingPrompt = action.payload
    },
  },
})

export const { setPendingChatPrompt } = slice.actions

const injectedChatSlice = rootReducer.inject(slice)

declare module 'reducers' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface LazyLoadedSlices extends WithSlice<typeof slice> {}
}

export const selectPendingChatPrompt = injectedChatSlice.selector(
  (state) => state.chat.pendingPrompt
)

export default slice.reducer
