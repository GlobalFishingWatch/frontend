import { createSelector } from '@reduxjs/toolkit'
import GFWAPI from '@globalfishingwatch/api-client/dist/api-client'
import {
  getDataviewsGeneratorConfigs,
  UrlDataviewInstance,
} from '@globalfishingwatch/dataviews-client'
import { Generators } from '@globalfishingwatch/layer-composer'
import {
  selectDataviewInstancesResolved,
  selectDefaultBasemapGenerator,
  selectDefaultOfflineDataviewsGenerators,
} from 'features/dataviews/dataviews.selectors'
import { selectVesselsStatus } from 'features/vessels/vessels.slice'
import { AsyncReducerStatus } from 'utils/async-slice'
import { ResourcesState, selectResources } from 'features/resources/resources.slice'
import { DEFAULT_WORKSPACE } from 'data/config'
import { Range } from 'types'

export const selectGlobalGeneratorsConfig = createSelector(
  [
    // selectViewport, selectTimeRange
  ],
  () =>
    // { zoom }, { start, end }
    ({
      zoom: DEFAULT_WORKSPACE.zoom,
      start: DEFAULT_WORKSPACE.start,
      end: DEFAULT_WORKSPACE.end,
      token: GFWAPI.getToken(),
    })
)

type GetGeneratorConfigParams = {
  dataviews: UrlDataviewInstance[] | undefined
  resources: ResourcesState
  rulers: Generators.Ruler[]
  highlightedTime?: Range
  staticTime: Range
  bivariate: boolean
}

const getGeneratorsConfig = ({
  dataviews = [],
  resources,
  // rulers = [],
  // highlightedTime,
  staticTime,
}: GetGeneratorConfigParams) => {
  const generatorOptions = {
    // highlightedTime,
    timeRange: staticTime,
  }

  const generatorsConfig = getDataviewsGeneratorConfigs(dataviews, generatorOptions, resources)

  // Avoid entering rulers sources and layers when no active rules
  // if (rulers?.length) {
  //   const rulersGeneratorConfig = {
  //     type: Generators.Type.Rulers,
  //     id: 'rulers',
  //     data: rulers,
  //   }
  //   return [...generatorsConfig.reverse(), rulersGeneratorConfig] as AnyGeneratorConfig[]
  // }

  return generatorsConfig.reverse()
}

const selectMapGeneratorsConfig = createSelector(
  [
    selectDataviewInstancesResolved,
    selectResources,
    // selectRulers,
    // selectDebugOptions,
    // selectHighlightedTime,
    // selectStaticTime,
    // selectBivariate,
  ],
  (
    dataviews = [],
    resources
    //rulers, debugOptions, highlightedTime, staticTime, bivariate
  ) => {
    return getGeneratorsConfig({
      dataviews,
      resources,
      rulers: [],
      // debugOptions,
      staticTime: {
        start: DEFAULT_WORKSPACE.start,
        end: DEFAULT_WORKSPACE.end,
      },
      bivariate: false,
    })
  }
)

export const selectDefaultMapGeneratorsConfig = createSelector(
  [
    selectVesselsStatus,
    // isWorkspaceLocation,
    selectDefaultBasemapGenerator,
    selectMapGeneratorsConfig,
    selectDefaultOfflineDataviewsGenerators,
    // selectMapWorkspacesListGenerators,
  ],
  (
    vesselStatus,
    // showWorkspaceDetail,
    basemapGenerator,
    mapGeneratorsConfig,
    offlineDataviewsGenerators
    // workspaceListGenerators
  ) => {
    // if (vesselStatus === AsyncReducerStatus.Loading) {
    //   return offlineDataviewsGenerators.concat([basemapGenerator])
    // }

    return vesselStatus !== AsyncReducerStatus.Finished
      ? [...offlineDataviewsGenerators, basemapGenerator]
      : [...offlineDataviewsGenerators, ...mapGeneratorsConfig]
  }
)
