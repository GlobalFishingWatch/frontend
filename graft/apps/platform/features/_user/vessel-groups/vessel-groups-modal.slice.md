# apps/platform/features/_user/vessel-groups/vessel-groups-modal.slice.ts · [[concurrent-request-deduplication-retry-logic]] [[csv-vessel-import-column-validation]] [[dataset-dataview-integration]] [[vessel-group-vessel-identity-reconciliation]] [[vessel-groups-management-system]]

Redux slice managing vessel group modal state, including search/filter UI, vessel list operations, and async thunks for fetching and searching vessels.

- VesselGroupConfirmationMode · type · L47-L47 — Type alias defining the three possible confirmation modes when saving or updating a vessel group.
- VesselGroupCsvData · type · L49-L49 — Type alias for a record mapping CSV column names to string values during bulk vessel upload.
- VesselGroupModalState · interface · L50-L66 — Redux state shape holding the modal's open/closed status, search form state, vessel results, and edit metadata.
- SearchVesselsBody · type · L68-L74 — Type defining the POST body structure for searching vessels by dataset, ID list, or properties.
- FetchSearchVessels · type · L75-L75 — Type defining request parameters for a single vessel search API call.
- fetchSearchVessels · function · L77-L94 — Fetches one page of vessel search results from the GFW API, supporting pagination via token parameter.
- getAllSearchVesselsUrl · function · L97-L115 — Constructs the fully-resolved search endpoint URL for a given dataset with vessel search and self-reported inclusion config.
- fetchAllSearchVessels · function · L116-L130 — Paginates through all vessel search results by repeatedly calling fetchSearchVessels until all entries are retrieved.
- SearchVesselsInVGParams · type · L132-L141 — Type defining parameters for searching vessels within a vessel group by ID or CSV data.
- ParsedSearchInput · type · L143-L145 — Discriminated union type representing either ID-based or CSV row-based vessel search input after parsing.
- searchVesselsInVesselGroup · function · L147-L239 — Searches for vessels in a vessel group by constructing SQL WHERE clauses from ID or CSV input and fetching matching vessels.
- resolveSearchProperty · function · L173-L180 — Resolves the search API property name for a given vessel property, applying VMS prefix logic based on dataset filters.
- normalizeMatchValue · function · L241-L248 — Normalizes vessel identifier strings by removing accents, special characters, and extra whitespace for comparison.
- getUnmatchedInputs · function · L250-L270 — Identifies vessel IDs or CSV rows from input that did not match any of the returned vessel search results.
- GetVesselsInVGParams · type · L272-L276 — Type defining parameters for fetching the complete list of vessels already in a vessel group.
- getVesselsInVesselGroup · function · L277-L314 — Fetches and merges vessel identity details from the API for all vessels already assigned to a vessel group.
- extraReducers · method · L483-L516 — Registers async thunk lifecycle handlers to update search status and vessel results on pending, fulfilled, or rejected events.
- selectVesselGroupModalOpen · function · L535-L535 — Selector to retrieve whether the vessel group modal is currently open.
- selectVesselGroupModalSearchIdField · function · L536-L537 — Selector to retrieve the currently selected ID field type (e.g., mmsi, imo) for vessel searches.
- selectVesselGroupModalCsvColumns · function · L538-L539 — Selector to retrieve the list of CSV column headers parsed from an uploaded file.
- selectVesselGroupModalCsvData · function · L540-L541 — Selector to retrieve the parsed CSV row data for bulk vessel search.
- selectVesselGroupModalUnmatchedIDs · function · L542-L543 — Selector to retrieve the list of input vessel IDs that did not match any search results.
- selectVesselGroupSearchStatus · function · L544-L545 — Selector to retrieve the current async status of the vessel search operation (idle, loading, finished, or error).
- selectVesselGroupModalSources · function · L546-L546 — Selector to retrieve the data sources selected for the vessel group.
- selectVesselGroupModalName · function · L547-L547 — Selector to retrieve the vessel group's name entered or being edited in the modal.
- selectVesselGroupModalVessels · function · L548-L548 — Selector to retrieve the list of vessels currently displayed or selected in the modal.
- selectVesselGroupsModalSearchText · function · L549-L550 — Selector to retrieve the search text (raw input) entered in the vessel search form.
- selectVesselGroupEditId · function · L551-L552 — Selector to retrieve the ID of the vessel group currently being edited, if any.
- selectVesselGroupConfirmationMode · function · L553-L554 — Selector to retrieve the confirmation mode (save, update, or saveAndSeeInWorkspace) for the current operation.
