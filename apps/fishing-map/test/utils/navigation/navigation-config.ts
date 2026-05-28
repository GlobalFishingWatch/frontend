import type { AppRouter } from '../../../router'

export type NavigationConfig = Parameters<AppRouter['navigate']>[0]
