import type { Questions } from '@typesafe-ai/sdk'
import { choice, noul } from '@typesafe-ai/sdk'

import type { PlanContext, Step } from './step'

// Which page of the app answers the message (round 1), then the details only that page has:
// the account tab and the searched vessel name (round 2).

export type RouteKind =
  | 'workspace'
  | 'report'
  | 'workspace_and_report'
  | 'ports-report'
  | 'vessel'
  | 'vessel-search'
  | 'workspaces-list'
  | 'user'
  | 'same'

export type RouteDecision = {
  /** `same`: keep the page of `current_map` (follow-ups only) */
  type: RouteKind
  /** Whole-world scope: global report instead of an area one */
  global: boolean
}

/** The page the answer lands on, with `same` resolved against the current map */
export const getPage = (ctx: PlanContext, route: RouteDecision): string =>
  route.type === 'same' ? (ctx.current?.route.type ?? 'workspace') : route.type

const ROUTE_CRITERIA: Record<Exclude<RouteKind, 'same'>, string> = {
  workspace:
    'Browse or compare activity on the map, optionally around a place, e.g. "fishing of Spain and France", "dark vessels around Gabon", "encounters in the last 7 days"',
  report:
    'Aggregated statistics restricted to an area (EEZ, FAO area, RFMO, marine protected area) or to the whole world, e.g. "trawlers activity report in Italy", "squid jigging in IATTC", "global fishing last June"',
  workspace_and_report:
    'Could be answered equally well by the map or by a report over an area, and the message does not say which',
  'ports-report': 'Activity of one specific port, e.g. "vessels visiting Camarones"',
  vessel: 'The profile of one specific, already identified vessel',
  'vessel-search': 'Find vessels by name, MMSI, IMO, callsign, owner or flag',
  'workspaces-list': 'A list or index of curated workspaces, e.g. "marine manager workspaces"',
  user: "The user's own account: saved workspaces, uploaded datasets, saved reports, vessel groups",
}

export const routeStep: Step<RouteDecision> = {
  needs: [],
  questions(ctx) {
    return {
      'route.type': choice('Which page of the Global Fishing Watch map does `message` ask for?', {
        ...ROUTE_CRITERIA,
        ...(ctx.current && {
          same: 'The same page as `current_map`, with the changes the message asks for',
        }),
      }),
      'route.global': noul(
        'Does `message` ask about the whole world, rather than a specific place?',
        { true: 'e.g. "global fishing", "worldwide encounters"' }
      ),
    }
  },
  resolve(read, ctx) {
    return {
      type: read.choice<RouteKind>('route.type', 'the page', ctx.current ? 'same' : 'workspace'),
      global: read.yes('route.global'),
    }
  },
}

export const USER_TABS = ['info', 'workspaces', 'datasets', 'reports', 'vesselGroups'] as const
export type UserTab = (typeof USER_TABS)[number]

export type AccountDecision = { userTab: UserTab }

export const accountStep: Step<AccountDecision, 'route'> = {
  needs: ['route'],
  questions(ctx, { route }): Questions {
    if (getPage(ctx, route) !== 'user') return {}
    return {
      'account.tab': choice(
        'Which part of their account does `message` ask for?',
        Object.fromEntries(USER_TABS.map((tab) => [tab, null]))
      ),
    }
  },
  resolve(read) {
    return { userTab: read.choice<UserTab>('account.tab', 'the account tab', 'info') }
  },
}

// Jev can't generate text, so the name is a Choice over word sequences of the message itself
// (docs cookbook: "pre-parsed value extraction"). Code builds the candidates, Jev picks one.
const STOPWORDS = new Set(
  'a an and any by called find for from i in is me my name named of on only search see show ship ships the to vessel vessels want with'.split(
    ' '
  )
)
const MAX_CANDIDATES = 250 // Jev accepts up to 255 options per Choice

export const getNameCandidates = (message: string) => {
  const words = message.match(/[\p{L}\p{N}'-]+/gu) ?? []
  const candidates = new Set<string>()
  for (let size = 1; size <= 3; size++) {
    for (let i = 0; i + size <= words.length; i++) {
      const gram = words.slice(i, i + size)
      if (STOPWORDS.has(gram[0].toLowerCase()) || STOPWORDS.has(gram.at(-1)!.toLowerCase()))
        continue
      candidates.add(gram.join(' '))
    }
  }
  return [...candidates].slice(0, MAX_CANDIDATES)
}

export type SearchDecision = {
  /** Vessel name for the search `query`, picked from the message's own words */
  vesselName?: string
}

export const searchStep: Step<SearchDecision, 'route'> = {
  needs: ['route'],
  questions(ctx, { route }): Questions {
    const candidates = getNameCandidates(ctx.message)
    if (getPage(ctx, route) !== 'vessel-search' || !candidates.length) return {}
    return {
      'search.vessel_name': choice('Which of these is the name of a vessel in `message`?', {
        none: 'No vessel name is given',
        ...Object.fromEntries(candidates.map((name) => [name, null])),
      }),
    }
  },
  resolve(read) {
    const vesselName = read.choice('search.vessel_name', 'the vessel name', 'none')
    return vesselName === 'none' ? {} : { vesselName }
  },
}
