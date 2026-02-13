import i18n from 'i18next'
import { beforeAll, vi } from 'vitest'

import '../pages/styles.css'
import './test-styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

beforeAll(async () => {
  // Set the system time to December 1st, 2025 at 12:00 PM UTC
  vi.setSystemTime(new Date('2025-12-01T12:00:00.000Z'))

  // Ensure i18n is initialized before running tests
  await i18n.changeLanguage('en')

  // Setup localstorage modal shown flag to prevent it from appearing in tests
  if (typeof window !== 'undefined') {
    localStorage.setItem('MarineManagerPopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('VesselProfilePopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('WelcomePopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('DeepSeaMiningPopup', '{"visible":false,"showAgain":false}')
    localStorage.setItem('HighlightPopup', '"sentinel2"')
  }
})
