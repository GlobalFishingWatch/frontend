import type { EntryType, Questions, TypeSafeClient, Usage } from '@typesafe-ai/sdk'

import type { DecodedMapUrl } from '../decode-url/decode'
import { decodeMapUrl } from '../decode-url/decode'

import { filtersStep } from './steps/filters'
import { layersStep } from './steps/layers'
import { modeStep } from './steps/mode'
import { areaTypesStep, placesStep } from './steps/places'
import { reportStep } from './steps/report'
import { accountStep, routeStep, searchStep } from './steps/route'
import type { PlanContext, Step, StepName } from './steps/step'
import { periodStep, timeStep } from './steps/time'
import type { Decisions, Draft } from './draft'
import { buildDraft } from './draft'
import type { JevAnswers } from './jev'
import { createAnswerReader, createJevClient } from './jev'

// One step per concern. Steps run in rounds decided by their `needs`: every step whose needs
// are resolved goes into the same Jev request, so today's order is
//   1. mode, route, layers, areaTypes, period
//   2. account, search, places, time, report
//   3. filters
// Each round only asks what the earlier answers made relevant.
const STEPS: { [Name in StepName]: Step<Decisions[Name], StepName> } = {
  mode: modeStep,
  route: routeStep,
  account: accountStep,
  search: searchStep,
  layers: layersStep,
  areaTypes: areaTypesStep,
  places: placesStep,
  period: periodStep,
  time: timeStep,
  filters: filtersStep,
  report: reportStep,
}

export type PlanMapUrlInput = {
  /** The user's latest message */
  message: string
  /** The map URL the user is looking at, for follow-ups */
  currentUrl?: string
  /** ISO datetime used for relative periods. Defaults to now */
  now?: string
  /** Replay recorded answers instead of calling Jev (tests, offline iteration) */
  answers?: JevAnswers
}

export type JevRound = {
  steps: StepName[]
  questions: number
  usage?: Usage
  ms: number
}

export type PlanMapUrlResult = Draft & {
  /** What the final LLM step must resolve before encoding. Empty = encode the draft as-is */
  todo: string[]
  decisions: Decisions
  /** Every round's answers merged: pass it back as `answers` to replay the plan */
  jev: { model: string; rounds: JevRound[]; answers: JevAnswers }
}

// Jev reads the current map as a short summary: its accuracy drops with irrelevant state
const summarizeMap = ({ route, layers, timeRange }: DecodedMapUrl) => ({
  page: route.type,
  ...(route.areaId && { report_areas: route.areaId }),
  layers: layers
    .filter((layer) => layer.visible && layer.category !== 'context')
    .map((layer) => ({ name: layer.name, ...(layer.filters && { filters: layer.filters }) })),
  ...(timeRange && { time_range: timeRange }),
})

export const planMapUrl = async ({
  message,
  currentUrl,
  now,
  answers: replay,
}: PlanMapUrlInput): Promise<PlanMapUrlResult> => {
  const current = currentUrl ? decodeMapUrl(currentUrl) : undefined
  const ctx: PlanContext = { message, now: now ? new Date(now) : new Date(), current, todo: [] }
  const state = { message, ...(current && { current_map: summarizeMap(current) }) } as EntryType

  let client: TypeSafeClient | undefined
  let model = replay ? 'replay' : ''
  const answers: JevAnswers = {}
  const rounds: JevRound[] = []
  const decided: Partial<Decisions> = {}
  let pending = Object.keys(STEPS) as StepName[]

  while (pending.length) {
    const ready = pending.filter((name) => STEPS[name].needs.every((need) => need in decided))
    if (!ready.length) throw new Error(`Steps with unresolvable needs: ${pending.join(', ')}`)
    const deps = decided as Decisions
    const questions: Questions = Object.assign(
      {},
      ...ready.map((name) => STEPS[name].questions(ctx, deps))
    )

    const started = Date.now()
    const count = Object.keys(questions).length
    if (replay) {
      Object.assign(answers, replay)
    } else if (count) {
      client ??= createJevClient()
      const response = await client.systemOne({ state, questions })
      model = response.model
      Object.assign(answers, response.answers)
      rounds.push({
        steps: ready,
        questions: count,
        usage: response.usage,
        ms: Date.now() - started,
      })
    }

    const read = createAnswerReader(answers, ctx.todo)
    for (const name of ready) {
      ;(decided as Record<StepName, unknown>)[name] = STEPS[name].resolve(read, ctx, deps)
    }
    pending = pending.filter((name) => !ready.includes(name))
  }

  const decisions = decided as Decisions
  return {
    ...buildDraft(decisions, ctx),
    todo: ctx.todo,
    decisions,
    jev: { model, rounds, answers },
  }
}
