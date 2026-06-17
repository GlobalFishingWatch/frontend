import type { Dataview } from '@globalfishingwatch/api-types'
import { DataviewCategory } from '@globalfishingwatch/api-types'

import { PATH_BASENAME } from 'data/config'
import type { LibraryLayer } from 'data/layer-library'
import { LIBRARY_LAYERS } from 'data/layer-library'
import { BATHYMETRY_CONTOUR_DATAVIEW_SLUG } from 'data/workspaces'
import { BATHYMETRY_CONTOUR_DATAVIEW_PREFIX } from 'features/dataviews/dataviews.utils'
import { t } from 'features/i18n/i18n'
import { getNextColor } from 'features/workspace/workspace.utils'

export const resolveLibraryLayers = (
  dataviews: Dataview<any, DataviewCategory>[],
  {
    experimentalLayers,
    avoidColors = [],
  }: {
    experimentalLayers: boolean
    avoidColors?: string[]
  }
): LibraryLayer[] => {
  const layers = LIBRARY_LAYERS.flatMap((layer) => {
    const dataview = dataviews.find((d) => d.slug === layer.dataviewId)
    if (!dataview) {
      console.warn('Dataview not found for layer library dataview', layer.dataviewId)
      return []
    }
    const nextColor = getNextColor('fill', avoidColors)
    return {
      ...layer,
      config: {
        ...(layer.config && { ...layer.config }),
        ...(avoidColors.includes(layer.config?.color as string) && {
          color: nextColor.value,
          colorRamp: nextColor.id,
        }),
      },
      name: t((t) => t[layer.id].name, {
        ns: 'layer-library',
      }),
      description: t((t) => t[layer.id].description, {
        ns: 'layer-library',
      }),
      moreInfoLink: t((t) => t[layer.id].moreInfoLink, {
        ns: 'layer-library',
      }),
      category: (layer.category || dataview.category) as DataviewCategory,
      dataview: {
        ...dataview,
        datasetsConfig: [...(dataview.datasetsConfig || []), ...(layer.datasetsConfig || [])],
      },
    }
  })

  if (experimentalLayers) {
    layers.push({
      id: BATHYMETRY_CONTOUR_DATAVIEW_PREFIX,
      dataviewId: BATHYMETRY_CONTOUR_DATAVIEW_SLUG,
      config: {
        color: '#ffffff',
      },
      category: DataviewCategory.Environment,
      name: t((t) => t['bathymetry-contour'].name, {
        ns: 'layer-library',
      }),
      description: t((t) => t['bathymetry-contour'].description, {
        ns: 'layer-library',
      }),
      moreInfoLink: '',
      previewImageUrl: `${PATH_BASENAME}/images/layer-library/bathymetry-contour.jpg`,
      dataview: {} as any,
    })
  }
  return layers
}
