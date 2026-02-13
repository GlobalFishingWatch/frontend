import type { ChoiceOption } from '@globalfishingwatch/ui-components'

import { t } from 'features/i18n/i18n'
import type { IssueType } from 'features/track-correction/track-correction.slice'

export {
  TURNING_TIDES_WORKSPACES_IDS,
  TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE,
} from './track-correction.constants'
export type { TurningTidesWorkspaceId } from './track-correction.constants'

export function getTrackCorrectionIssueOptions() {
  const issueTypesOptions: ChoiceOption<IssueType>[] = [
    { id: 'falsePositive', label: t((t) => t.trackCorrection.falsePositive) },
    { id: 'falseNegative', label: t((t) => t.trackCorrection.falseNegative) },
    { id: 'other', label: t((t) => t.trackCorrection.other) },
  ]
  return issueTypesOptions
}
