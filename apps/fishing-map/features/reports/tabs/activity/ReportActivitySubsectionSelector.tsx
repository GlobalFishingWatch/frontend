import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectReportCategory, selectReportSubCategory } from 'features/reports/reports.selectors'
import type {
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
} from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { useReportFeaturesLoading } from 'features/reports/tabs/activity/reports-activity-timeseries.hooks'
import { useLocationConnect } from 'routes/routes.hook'

function ReportActivitySubsectionSelector() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const subsection = useSelector(selectReportSubCategory)
  const loading = useReportFeaturesLoading()
  const fitAreaInViewport = useFitAreaInViewport()

  const options: ChoiceOption<ReportActivitySubCategory | ReportDetectionsSubCategory>[] =
    reportCategory === ReportCategory.Activity
      ? [
          {
            id: 'fishing',
            label: t('common.apparentFishing', 'Apparent fishing effort'),
            disabled: loading,
          },
          {
            id: 'presence',
            label: t('common.vesselPresence', 'Vessel presence'),
            disabled: loading,
          },
        ]
      : [
          {
            id: 'viirs',
            label: t('common.viirs', 'Night light detections (VIIRS)'),
            disabled: loading,
          },
          {
            id: 'sar',
            label: t('common.sar', 'Radar vessel detections (SAR)'),
            disabled: loading,
          },
        ]

  const onSelectSubsection = (
    option: ChoiceOption<ReportActivitySubCategory | ReportDetectionsSubCategory>
  ) => {
    if (subsection !== option.id) {
      const queryParam =
        reportCategory === ReportCategory.Activity
          ? 'reportActivitySubCategory'
          : 'reportDetectionsSubCategory'
      dispatchQueryParams({ [queryParam]: option.id })
      fitAreaInViewport()
      dispatch(resetReportData())
      trackEvent({
        category: TrackCategory.Analysis,
        action: `activity_tab_toggle_${option.id}`,
      })
    }
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

export default ReportActivitySubsectionSelector
