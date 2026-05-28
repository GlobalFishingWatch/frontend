import type { NavigateOptions } from '@tanstack/react-router'

import type { AppRouter } from '../../../router'
import type { RoutePathValues } from '../../../router/routes.utils'

export type NavigationConfig<TTo extends RoutePathValues> = NavigateOptions<
  AppRouter,
  string,
  TTo
>
