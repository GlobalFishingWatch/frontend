import { useCallback, useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { urlSyncEffect } from 'recoil-sync'
import { object, string } from '@recoiljs/refine'
import { useDebounce } from '@globalfishingwatch/react-hooks'
import { DEFAULT_WORKSPACE } from 'data/config'

const DEFAULT_TIMERANGE = { start: DEFAULT_WORKSPACE.start, end: DEFAULT_WORKSPACE.end }

export type TimebarRange = { start: string; end: string }

const timebarChecker = object({
  start: string(),
  end: string(),
})

export const URLTimeRangeAtom = atom<TimebarRange | null>({
  key: 'timerange',
  default: DEFAULT_TIMERANGE,
  effects: [urlSyncEffect({ refine: timebarChecker, history: 'replace', syncDefault: true })],
})

export const TimeRangeAtom = atom<TimebarRange | null>({
  key: 'localTimerange',
  default: URLTimeRangeAtom,
  effects: [],
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

export const useURLTimerange = () => {
  const timerange = useRecoilValue(TimeRangeAtom)
  const setURLTimerange = useSetRecoilState(URLTimeRangeAtom)
  const debouncedTimerange = useDebounce(timerange, 600)

  useEffect(() => {
    setURLTimerange(debouncedTimerange)
  }, [debouncedTimerange, setURLTimerange])
}
