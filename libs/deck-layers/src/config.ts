export const IS_TEST_ENV =
  typeof process !== 'undefined' &&
  (process.env?.NODE_ENV === 'test' || process.env?.VITEST === 'true')
