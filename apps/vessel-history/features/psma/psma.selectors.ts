import { createSelector } from '@reduxjs/toolkit'
import { memoize } from 'lodash'
import type { RootState } from 'store'

import { psmaEntityAdapter } from './psma.slice'

const { selectById } = psmaEntityAdapter.getSelectors<RootState>((state) => state.psma)

export const selectPsmaEarliestDateById = memoize((id: string) =>
  createSelector([(state: RootState) => state], (state) => {
    const psma = selectById(state, id)
    if (!psma) return

    const { ratification, acceptance, approval, accession } = psma

    const dates = [ratification, acceptance, approval, accession].filter(
      (date) => date && date !== null
    )

    return (dates as string[]).sort((a, b) => (a > b ? 1 : -1)).pop()
  })
)

export const selectPsmaStatus = (state: RootState) => state.psma.status
