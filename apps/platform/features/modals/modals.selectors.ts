import { createSelector } from '@reduxjs/toolkit'

import { DEEP_SEA_MINING_WORKSPACE_ID, WorkspaceCategory } from '@platform/config/map/workspaces'

import { selectDownloadActivityModalOpen } from 'features/_map/download/download.selectors'
import { selectVesselGroupModalOpen } from 'features/_user/vessel-groups/vessel-groups-modal.slice'
import {
  selectDatasetUploadModalOpen,
  selectDownloadTrackModalOpen,
  selectFeedbackModalOpen,
  selectLayerLibraryModalOpen,
  selectScreenshotModalOpen,
  selectVesselCorrectionModalOpen,
} from 'features/modals/modals.slice'
import type { WelcomeContentKey } from 'features/welcome/welcome.content'
import {
  selectIsAnyVesselLocation,
  selectIsStandaloneSearchLocation,
  selectLocationCategory,
  selectWorkspaceId,
} from 'router/routes.selectors'

const selectAppModals = createSelector(
  [
    selectFeedbackModalOpen,
    selectLayerLibraryModalOpen,
    selectDatasetUploadModalOpen,
    selectScreenshotModalOpen,
    selectVesselCorrectionModalOpen,
    selectVesselGroupModalOpen,
    selectDownloadTrackModalOpen,
    selectDownloadActivityModalOpen,
  ],
  (
    feedbackModalOpen,
    layerLibraryModalOpen,
    datasetUploadModalOpen,
    screenshotModalOpen,
    infoCorrectionModalOpen,
    vesselGroupsModalOpen,
    downloadTrackModalOpen,
    downloadActivityModalOpen
  ) => {
    return {
      feedback: feedbackModalOpen,
      layerLibrary: layerLibraryModalOpen,
      datataset: datasetUploadModalOpen,
      screenshot: screenshotModalOpen,
      vesselCorrection: infoCorrectionModalOpen,
      vesselGroups: vesselGroupsModalOpen,
      downloadTrack: downloadTrackModalOpen,
      downloadActivity: downloadActivityModalOpen,
    }
  }
)

export const selectWelcomeModalKey = createSelector(
  [
    selectLocationCategory,
    selectWorkspaceId,
    selectIsAnyVesselLocation,
    selectIsStandaloneSearchLocation,
  ],
  (
    locationCategory,
    workspaceId,
    isAnyVesselLocation,
    isStandaloneSearchLocation
  ): WelcomeContentKey | undefined => {
    if (
      locationCategory === WorkspaceCategory.FishingActivity &&
      workspaceId === DEEP_SEA_MINING_WORKSPACE_ID
    ) {
      return 'deep-sea-mining'
    }
    return isAnyVesselLocation || isStandaloneSearchLocation ? 'vessel-profile' : undefined
  }
)

export const selectAnyAppModalOpen = createSelector([selectAppModals], (modals) => {
  return Object.values(modals).some((m) => m === true)
})
