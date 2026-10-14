import type { Locale } from '@globalfishingwatch/api-types'
import en from '@globalfishingwatch/i18n-labels/en/flags.json'
import es from '@globalfishingwatch/i18n-labels/es/flags.json'
import fr from '@globalfishingwatch/i18n-labels/fr/flags.json'
import id from '@globalfishingwatch/i18n-labels/id/flags.json'
import pt from '@globalfishingwatch/i18n-labels/pt/flags.json'

export const FLAG_LABELS: Record<`${Locale}`, Record<string, string>> = { en, es, fr, id, pt }
