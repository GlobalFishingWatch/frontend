import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption, TooltipPlacement } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectVGRStatus } from 'features/reports/report-vessel-group/vessel-group-report.slice'
import {
  selectActiveReportSubCategories,
  selectReportSubCategory,
} from 'features/reports/reports.selectors'
import type { ReportEventsSubCategory } from 'features/reports/reports.types'
import { useLocationConnect } from 'routes/routes.hook'
import { AsyncReducerStatus } from 'utils/async-slice'

function VesselGroupReportEventsSubsectionSelector() {
  const { t } = useTranslation()
  const { dispatchQueryParams } = useLocationConnect()
  const vesselGroupReportStatus = useSelector(selectVGRStatus)
  const subsection = useSelector(selectReportSubCategory)
  const activeReportSubCategories = useSelector(selectActiveReportSubCategories)
  const loading = vesselGroupReportStatus === AsyncReducerStatus.Loading

  const options: ChoiceOption<ReportEventsSubCategory>[] = [
    ...(activeReportSubCategories?.includes('encounter')
      ? [
          {
            id: 'encounter' as ReportEventsSubCategory,
            label: t('event.encountersShort', 'Encounters'),
            disabled: loading,
          },
        ]
      : []),
    ...(activeReportSubCategories?.includes('loitering')
      ? [
          {
            id: 'loitering' as ReportEventsSubCategory,
            label: t('event.loitering_other', 'Loitering events'),
          },
        ]
      : []),
    // TODO:CVP2 add gap events
    // ...(activeReportSubCategories?.includes('gap')
    //   ? [
    //       {
    //         id: 'gap' as ReportEventsSubCategory,
    //         label: t('event.gap_other', 'AIS off events'),
    //         disabled: true,
    //         tooltip: t('common.comingSoon', 'Coming Soon!'),
    //         tooltipPlacement: 'top' as TooltipPlacement,
    //       },
    //     ]
    //   : []),
    ...(activeReportSubCategories?.includes('port_visit')
      ? [
          {
            id: 'port_visit' as ReportEventsSubCategory,
            label: t('event.port_visit_other', 'Port visits'),
            tooltipPlacement: 'top' as TooltipPlacement,
          },
        ]
      : []),
  ]

  const onSelectSubsection = (option: ChoiceOption<ReportEventsSubCategory>) => {
    if (subsection !== option.id) {
      dispatchQueryParams({ reportEventsSubCategory: option.id })
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
