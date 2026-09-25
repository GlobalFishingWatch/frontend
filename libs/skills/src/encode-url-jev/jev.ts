// Jev (TypeSafe System One) through the official SDK: https://github.com/typesafe-ai/typesafe-sdk-js
// The SDK owns the HTTP call, auth (TYPESAFE_API_KEY), retries and the question/answer types;
// this file only adds how the plan reads answers.
import type { ChoiceResponse, NoulResponse, ScoreResponse } from '@typesafe-ai/sdk'
import { TypeSafeClient } from '@typesafe-ai/sdk'

/** Pinned instead of `jev-latest`: MIN_CONFIDENCE and YES are tuned against this version */
export const JEV_MODEL = 'jev-1.13.0'

/** Below this, a choice is not applied: it goes to the plan `todo` for the final LLM step */
export const MIN_CONFIDENCE = 0.5
/** A noul at or above this reads as yes */
export const YES = 0.5

export type JevAnswers = Record<string, NoulResponse | ChoiceResponse | ScoreResponse>

/** Created on first use: the constructor throws when TYPESAFE_API_KEY is missing */
export const createJevClient = () => new TypeSafeClient({ defaultModel: JEV_MODEL })

export type AnswerReader = {
  /** True when the noul is at or above YES */
  yes(key: string): boolean
  /**
   * The chosen option. When confidence is below MIN_CONFIDENCE it returns `fallback` instead,
   * and adds a todo with the top two options unless the model's own pick was already `fallback`
   * or `quiet` is set (speculative questions whose answer may not matter for this route)
   */
  choice<T extends string>(
    key: string,
    label: string,
    fallback: NoInfer<T>,
    options?: { quiet?: boolean }
  ): T
  /** Raw probability of each option, for decisions that combine options (e.g. "mentioned at all") */
  probabilities(key: string): Record<string, number>
}

export const createAnswerReader = (answers: JevAnswers, todo: string[]): AnswerReader => ({
  yes(key) {
    const answer = answers[key]
    return answer?.type === 'noul' && answer.noul >= YES
  },
  choice(key, label, fallback, { quiet = false } = {}) {
    const answer = answers[key]
    if (answer?.type !== 'choice') return fallback
    if (answer.confidence >= MIN_CONFIDENCE) return answer.choice as typeof fallback
    if (answer.choice !== fallback && !quiet) {
      const top = Object.entries(answer.probabilities)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 2)
        .map(([option, probability]) => `"${option}" (${probability.toFixed(2)})`)
      todo.push(
        `Unsure about ${label}: ${top.join(' or ')}. The draft uses "${fallback}"; change it if the message means the other.`
      )
    }
    return fallback
  },
  probabilities(key) {
    const answer = answers[key]
    return answer?.type === 'choice' ? { ...answer.probabilities } : {}
  },
})
