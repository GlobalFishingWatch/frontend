import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import { Choice } from '@globalfishingwatch/ui-components'

import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import {
  selectHasFishingDataviews,
  selectHasPresenceDataviews,
  selectHasSarDataviews,
  selectHasSentinel2Dataviews,
  selectHasViirsDataviews,
} from 'features/dataviews/selectors/dataviews.selectors'
import { useFitAreaInViewport } from 'features/reports/report-area/area-reports.hooks'
import { selectReportCategory, selectReportSubCategory } from 'features/reports/reports.selectors'
import type {
  ReportActivitySubCategory,
  ReportDetectionsSubCategory,
} from 'features/reports/reports.types'
import { ReportCategory } from 'features/reports/reports.types'
import { useReportFeaturesLoading } from 'features/reports/reports-timeseries.hooks'
import { resetReportData } from 'features/reports/tabs/activity/reports-activity.slice'
import { useLocationConnect } from 'routes/routes.hook'

function ReportActivitySubsectionSelector() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { dispatchQueryParams } = useLocationConnect()
  const reportCategory = useSelector(selectReportCategory)
  const reportSubCategory = useSelector(selectReportSubCategory)
  const hasFishingDataviews = useSelector(selectHasFishingDataviews)
  const hasPresenceDataviews = useSelector(selectHasPresenceDataviews)
  const hasViirsDataviews = useSelector(selectHasViirsDataviews)
  const hasSarDataviews = useSelector(selectHasSarDataviews)
  const hasSentinel2Dataviews = useSelector(selectHasSentinel2Dataviews)
  const loading = useReportFeaturesLoading()
  const fitAreaInViewport = useFitAreaInViewport()

  const options: ChoiceOption<ReportActivitySubCategory | ReportDetectionsSubCategory>[] =
    reportCategory === ReportCategory.Activity
      ? ([
          {
            id: 'fishing',
            label: t('common.apparentFishing'),
            disabled: loading || !hasFishingDataviews,
          },
          {
            id: 'presence',
            label: t('common.vesselPresence'),
            disabled: loading || !hasPresenceDataviews,
          },
        ] as ChoiceOption<ReportActivitySubCategory>[])
      : ([
          ...(hasViirsDataviews
            ? [
                {
                  id: 'viirs',
                  label: t('common.viirs'),
                  disabled: loading,
                },
              ]
            : []),
          ...(hasSarDataviews
            ? [
                {
                  id: 'sar',
                  label: t('common.sar'),
                  disabled: loading,
                },
              ]
            : []),
          ...(hasSentinel2Dataviews
            ? [
                {
                  id: 'sentinel-2',
                  label: t('common.sentinel2'),
                  disabled: loading,
                },
              ]
            : []),
        ] as ChoiceOption<ReportDetectionsSubCategory>[])

  const onSelectSubsection = (
    option: ChoiceOption<ReportActivitySubCategory | ReportDetectionsSubCategory>
  ) => {
    if (reportSubCategory !== option.id) {
      const queryParam =
        reportCategory === ReportCategory.Activity
          ? 'reportActivitySubCategory'
          : 'reportDetectionsSubCategory'
      dispatchQueryParams({ [queryParam]: option.id, reportComparisonDataviewIds: undefined })
      fitAreaInViewport()
      dispatch(resetReportData())
      trackEvent({
        category: TrackCategory.Analysis,
        action: `activity_tab_toggle_${option.id}`,
      })
    }
  }

  const selectedOption = reportSubCategory
    ? options.find((o) => o.id === reportSubCategory)
    : options[0]

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
