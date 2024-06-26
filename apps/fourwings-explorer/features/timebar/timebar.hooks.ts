import { useCallback, useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import { object, string, mixed } from '@recoiljs/refine'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { DEFAULT_URL_DEBOUNCE, DEFAULT_WORKSPACE } from 'data/config'

const DEFAULT_TIMERANGE = {
  start: DEFAULT_WORKSPACE.start,
  end: DEFAULT_WORKSPACE.end,
  selectedLayerId: '',
}

export type TimebarRange = { start: string; end: string; selectedLayerId?: any }

const timebarChecker = object({
  start: string(),
  end: string(),
  selectedLayerId: mixed(),
})

export const URLTimeRangeAtom = atom<TimebarRange | null>({
  key: 'timebar',
  default: DEFAULT_TIMERANGE,
  effects: [urlSyncEffect({ refine: timebarChecker, history: 'replace', syncDefault: true })],
})

export const TimeRangeAtom = atom<TimebarRange | null>({
  key: 'localTimerange',
  default: URLTimeRangeAtom,
  effects: [],
})

export const HighlightedTimeRangeAtom = atom<TimebarRange | null>({
  key: 'highlightedTimerange',
  default: null,
  effects: [],
})

export const useTimerange = () => {
  return useRecoilState(TimeRangeAtom)
}

export const useSelectedTimebarLayerId = (): [string, (id: string) => void] => {
  const [state, setState] = useRecoilState(TimeRangeAtom)
  const setLayerId = useCallback(
    (id: string) => {
      setState((atom) => ({ ...atom, selectedLayerId: id }))
    },
    [setState]
  )
  return [state.selectedLayerId, setLayerId]
}

export const useHighlightTimerange = () => {
  return useRecoilState(HighlightedTimeRangeAtom)
}

export const useURLTimerange = () => {
  const timerange = useRecoilValue(TimeRangeAtom)
  const setURLTimerange = useSetRecoilState(URLTimeRangeAtom)
  const debouncedTimerange = useDebounce(timerange, DEFAULT_URL_DEBOUNCE)

  useEffect(() => {
    setURLTimerange(debouncedTimerange)
  }, [debouncedTimerange, setURLTimerange])
}
