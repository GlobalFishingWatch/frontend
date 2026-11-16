/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

/** Injected by Vite `define` at build time. Omitted when the define is not applied. */
declare const __BUILD_ID__: string | undefined

/** The app's own `VITE_*` values are typed and validated in data/env.ts, read them from `clientEnv` */
interface ImportMetaEnv {
  readonly VITE_API_VERSION?: string
  readonly VITE_DEBUG_API_REQUESTS?: string
  readonly VITE_PIPE_DATASET_VERSION?: string
  readonly VITE_PIPE_DATASET_MINOR_VERSION?: string
  readonly VITE_TURNSTILE_SITE_KEY?: string
  readonly VITEST?: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
