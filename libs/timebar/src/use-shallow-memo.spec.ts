import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { useShallowMemo } from './use-shallow-memo'

describe('useShallowMemo', () => {
  it('keeps the same reference when shallow contents are unchanged', () => {
    const fn = () => undefined
    const { result, rerender } = renderHook(({ value }) => useShallowMemo(value), {
      initialProps: { value: { a: 1, b: 'x', fn } },
    })
    const first = result.current
    // New object literal, identical values.
    rerender({ value: { a: 1, b: 'x', fn } })
    expect(result.current).toBe(first)
  })

  it('returns a new reference when a value changes', () => {
    const { result, rerender } = renderHook(({ value }) => useShallowMemo(value), {
      initialProps: { value: { a: 1 } },
    })
    const first = result.current
    rerender({ value: { a: 2 } })
    expect(result.current).not.toBe(first)
    expect(result.current).toEqual({ a: 2 })
  })
})
