export type TimebarLabels = {
  playback?: {
    playAnimation?: string
    pauseAnimation?: string
    toogleAnimationLooping?: string
    moveBack?: string
    moveForward?: string
    changeAnimationSpeed?: string
  }
  timerange?: {
    title?: string
    start?: string
    end?: string
    last30days?: string
    last3months?: string
    last6months?: string
    lastYear?: string
    done?: string
  }
  bookmark?: {
    goToBookmark?: string
    deleteBookmark?: string
  }
  lastUpdate?: string
  intervals?: {
    hour?: string
    day?: string
    month?: string
    year?: string
  }
  setBookmark?: string
  zoomTo?: string
  timeRange?: string
}

export const DEFAULT_LABELS: TimebarLabels = {
  playback: {
    playAnimation: 'Play animation',
    pauseAnimation: 'Pause animation',
    toogleAnimationLooping: 'Toggle animation looping',
    moveBack: 'Move back',
    moveForward: 'Move forward',
    changeAnimationSpeed: 'Change animation speed',
  },
  timerange: {
    title: 'Select a time range',
    start: 'start',
    end: 'end',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    last6months: 'Last 6 months',
    lastYear: 'Last year',
    done: 'Done',
  },
  bookmark: {
    goToBookmark: 'Go to your bookmarked time range',
    deleteBookmark: 'Delete time range bookmark',
  },
  lastUpdate: 'Last update',
  setBookmark: 'Bookmark current time range',
  intervals: {
    hour: 'hours',
    day: 'days',
    month: 'months',
    year: 'years',
  },
}
