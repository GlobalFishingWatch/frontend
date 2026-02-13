/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_GATEWAY?: string
  readonly VITE_API_VERSION?: string
  readonly VITE_DEBUG_API_REQUESTS?: string
  readonly VITE_GOOGLE_ANALYTICS_TEST_MODE?: string
  readonly VITE_GOOGLE_MEASUREMENT_ID?: string
  readonly VITE_GOOGLE_TAG_MANAGER_ID?: string
  readonly VITE_PIPE_DATASET_VERSION?: string
  readonly VITE_PIPE_DATASET_MINOR_VERSION?: string
  readonly VITE_REPORT_DAYS_LIMIT?: string
  readonly VITE_SHOW_LEAVE_CONFIRMATION?: string
  readonly VITE_PUBLIC_URL?: string
  readonly VITE_USE_LOCAL_DATASETS?: string
  readonly VITE_USE_LOCAL_DATAVIEWS?: string
  readonly VITE_WORKSPACE_ENV?: string
  readonly VITE_I18N_DEBUG?: string
  readonly i18n_DEBUG?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
