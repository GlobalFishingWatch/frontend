import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { EventTypes } from '@globalfishingwatch/api-types'
import type { ChoiceOption, TooltipPlacement } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRStatus } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import {
  selectActiveReportSubCategories,
  selectReportSubCategory,
} from 'features/reports/reports.selectors'
import type { ReportEventsSubCategory } from 'features/reports/reports.types'
import { useReplaceQueryParams } from 'router/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

function VesselGroupReportEventsSubsectionSelector() {
  const { t } = useTranslation()
  const { replaceQueryParams } = useReplaceQueryParams()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectReportSubCategory)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading

  const options: ChoiceOption<ReportEventsSubCategory>[] = [
    ...(activeReportSubCategories?.includes(EventTypes.Encounter)
      ? [
          {
            id: EventTypes.Encounter,
            label: t((t) => t.event.encountersShort),
            disabled: loading,
          },
        ]
      : []),
    ...(activeReportSubCategories?.includes(EventTypes.Loitering)
      ? [
          {
            id: EventTypes.Loitering,
            label: t((t) => t.event.loitering, {
              count: 2,
            }),
          },
        ]
      : []),
    // TODO:CVP2 add gap events
    // ...(activeReportSubCategories?.includes('gap')
    //   ? [
    //       {
    //         id: 'gap' as ReportEventsSubCategory,
    //         label: t((t) => t.event.gap),
    //         disabled: true,
    //         tooltip: t((t) => t.common.comingSoon),
    //         tooltipPlacement: 'top' as TooltipPlacement,
    //       },
    //     ]
    //   : []),
    ...(activeReportSubCategories?.includes(EventTypes.Port)
      ? [
          {
            id: EventTypes.Port,
            label: t((t) => t.event.port_visit, {
              count: 2,
            }),
            tooltipPlacement: 'top' as TooltipPlacement,
          },
        ]
      : []),
  ]

  const onSelectSubsection = (option: ChoiceOption<ReportEventsSubCategory>) => {
    if (subsection !== option.id) {
      replaceQueryParams({ reportEventsSubCategory: option.id })
      trackEvent({
        category: TrackCategory.VesselGroupReport,
        action: `vessel_group_profile_events_tab_${option.id}_graph`,
      })
    }
  }

  if (options?.length <= 1) {
    return null
  }

  const selectedOption = subsection ? options.find((o) => o.id === subsection) : options[0]

  return (
    <Choice
      size="small"
      options={options}
      activeOption={selectedOption?.id}
      onSelect={onSelectSubsection}
    />
  )
}

export default VesselGroupReportEventsSubsectionSelector
