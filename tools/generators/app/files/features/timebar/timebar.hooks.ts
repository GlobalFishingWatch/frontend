import { useCallback } from 'react'
import { atom, useRecoilState } from 'recoil'
import { debounce } from 'lodash'
import { DEFAULT_CALLBACK_URL_KEY } from '@globalfishingwatch/react-hooks'
import store, { RootState } from 'store'
import { updateUrlTimerange } from 'routes/routes.actions'
import { selectUrlTimeRange } from 'routes/routes.selectors'
import { DEFAULT_WORKSPACE } from 'data/config'

const DEFAULT_TIMERANGE = { start: DEFAULT_WORKSPACE.start, end: DEFAULT_WORKSPACE.end }

export type TimebarRange = { start: string; end: string }

export const TimeRangeAtom = atom<TimebarRange | null>({
  key: 'timerange',
  default: DEFAULT_TIMERANGE,
  effects: [
    ({ trigger, setSelf, onSet }) => {
      const redirectUrl =
        typeof window !== 'undefined' ? window.localStorage.getItem(DEFAULT_CALLBACK_URL_KEY) : null
      const urlTimeRange = selectUrlTimeRange(store.getState() as RootState)

      if (trigger === 'get') {
        if (urlTimeRange) {
          setSelf({
            ...urlTimeRange,
          })
        } else if (redirectUrl) {
          try {
            // Workaround to get start and end date from redirect url as the
            // location reducer isn't ready until initialDispatch
            const url = new URL(JSON.parse(redirectUrl))
            const start = url.searchParams.get('start')
            const end = url.searchParams.get('end')
            if (start && end) {
              setSelf({ start, end })
            }
          } catch (e: any) {
            console.warn(e)
          }
        }
      }
      const updateTimerangeDebounced = debounce(store.dispatch(updateUrlTimerange), 1000)
      onSet((timerange) => {
        if (timerange) {
          updateTimerangeDebounced({ ...timerange })
        }
      })
    },
  ],
})

export const useTimerangeConnect = () => {
  const [timerange, setTimerange] = useRecoilState(TimeRangeAtom)

  const onTimebarChange = useCallback(
    ({ start, end }: TimebarRange) => {
      setTimerange({ start, end })
    },
    [setTimerange]
  )

  return { timerange, setTimerange, onTimebarChange }
}
