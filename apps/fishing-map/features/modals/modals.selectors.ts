import { createSelector } from '@reduxjs/toolkit'

import {
  DEEP_SEA_MINING_WORKSPACE_ID,
  DEFAULT_WORKSPACE_CATEGORY,
  WorkspaceCategory,
} from 'data/workspaces'
import {
  selectDownloadActivityModalOpen,
  selectDownloadTrackModalOpen,
} from 'features/download/download.selectors'
import {
  selectDatasetUploadModalOpen,
  selectFeedbackModalOpen,
  selectLayerLibraryModalOpen,
  selectScreenshotModalOpen,
  selectVesselCorrectionModalOpen,
} from 'features/modals/modals.slice'
import { selectVesselGroupModalOpen } from 'features/vessel-groups/vessel-groups-modal.slice'
import type { WelcomeContentKey } from 'features/welcome/welcome.content'
import {
  selectIsAnyVesselLocation,
  selectIsStandaloneSearchLocation,
  selectLocationCategory,
  selectWorkspaceId,
} from 'routes/routes.selectors'

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
  ): WelcomeContentKey => {
    if (
      locationCategory === WorkspaceCategory.FishingActivity &&
      workspaceId === DEEP_SEA_MINING_WORKSPACE_ID
    ) {
      return 'deep-sea-mining'
    }
    return isAnyVesselLocation || isStandaloneSearchLocation
      ? 'vessel-profile'
      : locationCategory || DEFAULT_WORKSPACE_CATEGORY
  }
)

export const selectAnyAppModalOpen = createSelector([selectAppModals], (modals) => {
  return Object.values(modals).some((m) => m === true)
})
