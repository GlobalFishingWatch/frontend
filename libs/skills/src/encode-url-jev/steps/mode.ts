import { choice, noul } from '@typesafe-ai/sdk'

import type { Step } from './step'

// Follow-ups only: how the message relates to the map the user already has open.
// What changes (layers, filters, places, time) comes from the other steps; this step only
// settles what they can't: start over, widen a filter, add vs replace a place, map vs report.

// Set by the app or the encoder, never something a user widens
const INTERNAL_FILTERS = ['distance_from_port_km']

export type ModeDecision = {
  /** Apply the other decisions on top of `current_map` instead of building from scratch */
  followUp: boolean
  /** "other gear types", "the rest": set this filter to empty on the layers that have it */
  clearFilter?: string
  /** "include FAO 87": keep the current report areas and append the new ones */
  addArea: boolean
  /** "only in Brazil": a place constraint turns the map into a report over that area */
  restrictToArea: boolean
}

export const modeStep: Step<ModeDecision> = {
  needs: [],
  questions(ctx) {
    if (!ctx.current) return {}
    // Only the filters the current map actually has can be widened
    const applied = [
      ...new Set(
        ctx.current.layers
          .filter((layer) => layer.visible)
          .flatMap((layer) => Object.keys(layer.filters ?? {}))
          .filter((id) => !INTERNAL_FILTERS.includes(id))
      ),
    ]
    return {
      'mode.new_request': noul(
        'Does `message` start a new request about a different topic, instead of refining, extending or changing the map described in `current_map`?',
        {
          true: 'A new, unrelated request, e.g. "show me my datasets" after a fishing map',
          false:
            'A follow-up on `current_map`, e.g. "and by flag?", "only in 2025", "and encounters?", "any passenger boats?"',
        }
      ),
      ...(applied.length && {
        'mode.clear_filter': choice(
          'Do the words of `message` ask for the "other", "remaining" or "non-<current>" values of a filter already applied in `current_map`?',
          {
            none: 'No filter is widened, including when `message` names a specific value to show, e.g. "any passenger boats?", "only trawlers"',
            ...Object.fromEntries(applied.map((id) => [id, id.replaceAll('_', ' ')])),
          }
        ),
      }),
      'mode.add_area': noul(
        'Does `message` ask to include another place while keeping the places already in `current_map`?',
        {
          true: 'Explicitly keeps the current places: "include FAO 87", "add Chile too", "as well as Peru"',
          false:
            'Moves to another place or names no place, e.g. "and in France?", "and close to Galápagos?", "only in Brazil"',
        }
      ),
      'mode.restrict_area': noul(
        'Does `message` use a word like "only", "just" or "restricted to" to limit the data to a place, e.g. "only in Brazil", "only in FAO 41"?',
        { false: 'Names a place without limiting to it, e.g. "and in France?", "around Gabon"' }
      ),
    }
  },
  resolve(read, ctx) {
    if (!ctx.current || read.yes('mode.new_request')) {
      return { followUp: false, addArea: false, restrictToArea: false }
    }
    const clearFilter = read.choice('mode.clear_filter', 'which filter to widen', 'none')
    return {
      followUp: true,
      ...(clearFilter !== 'none' && { clearFilter }),
      addArea: read.yes('mode.add_area'),
      restrictToArea: read.yes('mode.restrict_area'),
    }
  },
}
