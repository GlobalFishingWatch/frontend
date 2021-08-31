import { useState, useEffect } from 'react'
import { shallowEqual, useSelector } from 'react-redux'
// eslint-disable-next-line import/no-webpack-loader-syntax
import createActivityHighlightsWorker from 'workerize-loader!features/vessels/activity/vessels-highlight.worker'
import { selectResourcesLoading } from 'features/resources/resources.slice'
import { selectSettings, Settings } from 'features/settings/settings.slice'
import { RenderedEvent, selectEventsWithRenderingInfo } from './vessels-activity.selectors'
import * as ActivityHighlightsWorker from './vessels-highlight.worker'
import { selectAnyHighlightsSettingDefined } from './vessels-highlight.selectors'

const { filterActivityHighlightEvents } =
  createActivityHighlightsWorker<typeof ActivityHighlightsWorker>()

export const useActivityHighlightsConnect = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [highlightedEvents, setHighlightedEvents] = useState<RenderedEvent[] | undefined>([])

  const eventsLoading = useSelector(selectResourcesLoading)
  const allEvents = useSelector(selectEventsWithRenderingInfo, shallowEqual)
  const settings = useSelector(selectSettings, shallowEqual)
  const anyHighlightsSettingDefined = useSelector(selectAnyHighlightsSettingDefined)

  useEffect(() => {
    const computeHighlightedEvents = async (events: RenderedEvent[], settings: Settings) => {
      setLoading(true)
      setHighlightedEvents(undefined)
      const result: RenderedEvent[] = await filterActivityHighlightEvents(events, settings)
      setLoading(false)
      setHighlightedEvents(result)
      return result
    }
    if (anyHighlightsSettingDefined && !eventsLoading) {
      computeHighlightedEvents(allEvents, settings)
    } else {
      setHighlightedEvents(undefined)
    }
  }, [allEvents, anyHighlightsSettingDefined, eventsLoading, settings])

  return {
    loading: eventsLoading || loading,
    highlightsSettingDefined: anyHighlightsSettingDefined,
    highlightedEvents,
  }
}
