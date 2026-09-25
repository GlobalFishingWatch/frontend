import type { Questions } from '@typesafe-ai/sdk'

import type { DecodedMapUrl } from '../../decode-url/decode'
import type { Decisions } from '../draft'
import type { AnswerReader } from '../jev'

export type PlanContext = {
  message: string
  /** Reference date for relative periods ("last week") and years left unstated ("last June") */
  now: Date
  /** The user's current map, when the message is a follow-up on it */
  current?: DecodedMapUrl
  /** Items only the final LLM step can resolve. Steps and the answer reader append to it */
  todo: string[]
}

export type StepName = keyof Decisions

/**
 * One concern of the plan.
 *
 * `needs` lists the steps whose decisions this one reads. plan.ts runs steps in rounds: every
 * step whose needs are resolved asks its questions in the same Jev request (Jev answers them in
 * parallel), so a step only asks what the earlier answers made relevant: FAO areas only when
 * an FAO area is named, filters only for the layers that were picked.
 *
 * Question keys must be prefixed with the step name (`<step>.<name>`) so a round can't collide.
 * Return `{}` from `questions` when nothing is relevant: an empty round makes no request.
 */
export type Step<Decision, Needs extends StepName = never> = {
  needs: readonly Needs[]
  questions(ctx: PlanContext, decided: Pick<Decisions, Needs>): Questions
  resolve(read: AnswerReader, ctx: PlanContext, decided: Pick<Decisions, Needs>): Decision
}
