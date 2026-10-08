import type { NavigateOptions } from '@tanstack/react-router'

import type { RoutePathValues } from '@platform/config/routes'

import type { AppRouter } from '../../../router'

export type NavigationConfig<TTo extends RoutePathValues> = NavigateOptions<AppRouter, string, TTo>
