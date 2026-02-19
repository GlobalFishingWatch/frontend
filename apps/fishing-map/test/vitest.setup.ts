import i18n from 'i18next'
import { Settings } from 'luxon'
import { beforeAll, vi } from 'vitest'

import '../pages/styles.css'
import './test-styles.css'
import '@globalfishingwatch/ui-components/base.css'
import '@globalfishingwatch/timebar/timebar-settings.css'

// Set the system time to February 18th, 2026 at 12:00 PM UTC
const mockDate = new Date('2026-02-18T12:00:00.000Z')
vi.setSystemTime(mockDate)

// Mock Luxon's now() function globally
Settings.now = () => mockDate.valueOf()

beforeAll(async () => {
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
