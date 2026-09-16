# apps/platform/features/modals/modals.slice.ts · [[modal-system]]

Redux slice managing the state of all application modals including their open/closed status and configuration options.

- ModalId · type · L8-L17 — Union type enumerating all available modal identifiers in the application.
- BigQueryModalMode · type · L27-L27 — Union type for BigQuery modal display modes, either default or turning-tides.
- LayerLibraryMode · type · L29-L29 — Union type representing whether layer library modal is open and what category it displays.
- DatasetUploadStyle · type · L30-L30 — Union type for dataset upload modal presentation styles.
- DatasetUploadConfig · type · L31-L37 — Configuration object type for dataset upload modal, including file rejection and styling options.
- ModalsOpenState · type · L39-L54 — Complete state shape for all modals, tracking open status and configuration for each modal type.
- selectFeedbackModalOpen · function · L132-L132 — Selector to retrieve the feedback modal's open state from Redux.
- selectLayerLibraryModal · function · L133-L133 — Selector to retrieve the currently active layer library modal category.
- selectLayerLibraryModalOpen · function · L134-L135 — Selector to retrieve whether the layer library modal is currently open.
- selectLayerLibraryUniqueCategory · function · L136-L137 — Selector to retrieve whether the layer library modal is restricted to a single category.
- selectDatasetUploadModalConfig · function · L138-L138 — Selector to retrieve the complete dataset upload modal configuration object.
- selectDatasetUploadModalOpen · function · L139-L139 — Selector to retrieve the dataset upload modal's open state.
- selectEditWorkspaceModalOpen · function · L140-L140 — Selector to retrieve the edit workspace modal's open state.
- selectCreateWorkspaceModalOpen · function · L141-L141 — Selector to retrieve the create workspace modal's open state.
- selectScreenshotModalOpen · function · L142-L142 — Selector to retrieve the screenshot modal's open state.
- selectVesselCorrectionModalOpen · function · L143-L143 — Selector to retrieve the vessel correction modal's open state.
- selectEditorMenuOpen · function · L144-L144 — Selector to retrieve the editor menu's open state.
- selectDownloadTrackModalOpen · function · L145-L145 — Selector to retrieve the download track modal's open state.
- selectOnboardingModalOpen · function · L146-L146 — Selector to retrieve the onboarding modal's open state.
- selectBigQueryModalOpen · function · L147-L147 — Selector to determine if the BigQuery modal is open in default mode.
- selectTurningTidesModalOpen · function · L148-L149 — Selector to determine if the Turning Tides BigQuery modal is open.
