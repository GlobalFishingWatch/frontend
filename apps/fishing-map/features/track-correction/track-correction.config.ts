import type { ChoiceOption } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'
import type { IssueType } from 'features/track-correction/track-correction.slice'

const TURNING_TIDES_BRAZIL_ID = process.env.NEXT_TURNING_TIDES_BRAZIL_ID || ''
const TURNING_TIDES_CHILE_ID = process.env.NEXT_TURNING_TIDES_CHILE_ID || ''
const TURNING_TIDES_PERU_ID = process.env.NEXT_TURNING_TIDES_PERU_ID || ''
const TURNING_TIDES_AIS_ID = process.env.NEXT_TURNING_TIDES_AIS_ID || ''

export const TURNING_TIDES_WORKSPACES_IDS = [
  'tt-brazil-public',
  'tt-chile-public',
  'tt-peru-public',
  'tt_ais-public',
] as const

export type TurningTidesWorkspaceId = (typeof TURNING_TIDES_WORKSPACES_IDS)[number]

export const TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE: Record<TurningTidesWorkspaceId, string> =
  {
    'tt-brazil-public': TURNING_TIDES_BRAZIL_ID,
    'tt-chile-public': TURNING_TIDES_CHILE_ID,
    'tt-peru-public': TURNING_TIDES_PERU_ID,
    'tt_ais-public': TURNING_TIDES_AIS_ID,
  }

export function getTrackCorrectionIssueOptions() {
  const issueTypesOptions: ChoiceOption<IssueType>[] = [
    { id: 'falsePositive', label: t('trackCorrection.falsePositive') },
    { id: 'falseNegative', label: t('trackCorrection.falseNegative') },
    { id: 'other', label: t('trackCorrection.other') },
  ]
  return issueTypesOptions
}
