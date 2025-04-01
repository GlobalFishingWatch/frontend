import { createSelector } from 'reselect'

import { CONTEXT_LAYERS } from '../../../data/config'
import { selectHiddenLayers } from '../../../routes/routes.selectors'

export const getContextualLayers = createSelector([selectHiddenLayers], (hiddenLayers) => {
  const contextualLayers = CONTEXT_LAYERS.map((layer) => {
    const isHidden = hiddenLayers.includes(layer.id)
    return {
      ...layer,
      visible: !isHidden,
      // disabled: layer.id !== 'landmass',
    }
  })
  return contextualLayers
})
