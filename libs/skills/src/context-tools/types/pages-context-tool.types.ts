/** Content pages: get_places_page, get_vessel_search_results, get_help_page */

export type AssistantPlacesPage = {
  /** port, eez, fao, mpa, rfmo */
  placeType: string
  /** Places matching the search, of `total` */
  count: number
  total: number
}

export type AssistantVesselSearchResults = {
  status: string
  /** All matches; `results` holds the first loaded ones */
  total: number
  results: {
    id: string
    datasetId: string
    shipname?: string
    flag?: string
    ssvid?: string
    imo?: string
    callsign?: string
    shiptypes?: string[]
    geartypes?: string[]
    transmissionDateFrom?: string
    transmissionDateTo?: string
    /** Ticked by the user */
    selected: boolean
  }[]
}

export type AssistantHelpLink = { slug: string; title: string }

export type AssistantHelpPage =
  /** Landing */
  | { sections: { slug: string; articles: AssistantHelpLink[] }[] }
  /** Section page */
  | {
      section: string
      article?: AssistantHelpLink & { description?: string }
      sectionArticles: AssistantHelpLink[]
    }
