import { isEqual } from 'lodash'
import { createSelectorCreator, lruMemoize } from 'reselect'

/**
 * Returns a deep equal selector creator to prevent selectors recalculation
 * when input variables are objects thus not equal using the reference
 * equality selector (===) that createSelector uses by default.
 */
export const createDeepEqualSelector = createSelectorCreator(lruMemoize, isEqual)
