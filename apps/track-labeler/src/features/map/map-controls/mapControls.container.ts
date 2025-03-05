import { createSelector } from 'reselect'

import { CONTEXT_LAYERS } from '../../../data/config'
import { selectHiddenLayers } from '../../../routes/routes.selectors'
import { selectMapLayers } from '../map.selectors'

export const getContextualLayers = createSelector(
  [selectMapLayers, selectHiddenLayers],
  (layers, hiddenLayers) => {
    const contextualLayers = CONTEXT_LAYERS.map((layer) => {
      const isHidden = hiddenLayers.includes(layer.id)
      return {
        ...layer,
        visible: !isHidden,
        // disabled: layer.id !== 'landmass',
      }
    })
    return contextualLayers
  }
)
