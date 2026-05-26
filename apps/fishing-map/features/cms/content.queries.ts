import { Locale } from 'types'

import { strapiApi } from './loaders'
import type { TStrapiResponse, TUserGuideSection } from './strapi.types'

export function fetchUserGuideContent({
  locale = Locale.en,
}: {
  locale: Locale
}): Promise<TStrapiResponse<TUserGuideSection>> {
  return strapiApi.userGuide.getAll({ data: { locale } })
}
