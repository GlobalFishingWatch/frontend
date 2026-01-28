import i18n from 'i18next'
import { beforeAll, vi } from 'vitest'

beforeAll(async () => {
  // Set the system time to December 1st, 2025 at 12:00 PM UTC
  vi.setSystemTime(new Date('2025-12-01T12:00:00.000Z'))

  // Ensure i18n is initialized before running tests
  await i18n.changeLanguage('en')
})
