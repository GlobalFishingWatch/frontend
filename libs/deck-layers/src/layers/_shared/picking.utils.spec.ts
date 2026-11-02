import { describe, expect, it } from 'vitest'

import { getPickedFeatureToHighlight } from './picking.utils'

describe('getPickedFeatureToHighlight', () => {
  it('matches by gfw_id', () => {
    const picked = [{ properties: { gfw_id: 'a' } }] as any
    expect(getPickedFeatureToHighlight({ properties: { gfw_id: 'a' } }, picked)).toBe(true)
    expect(getPickedFeatureToHighlight({ properties: { gfw_id: 'b' } }, picked)).toBe(false)
  })

  it('falls back to the feature id when gfw_id is missing or null', () => {
    const picked = [{ id: 1, properties: {} }] as any
    expect(getPickedFeatureToHighlight({ id: 1, properties: {} }, picked)).toBe(true)
    expect(getPickedFeatureToHighlight({ id: 2, properties: { gfw_id: null } }, picked)).toBe(false)
  })

  it('never matches id-less features with each other', () => {
    const picked = [{ properties: { gfw_id: null } }] as any
    expect(getPickedFeatureToHighlight({ properties: {} }, picked)).toBe(false)
    expect(getPickedFeatureToHighlight({ properties: { gfw_id: null } }, picked)).toBe(false)
  })
})
