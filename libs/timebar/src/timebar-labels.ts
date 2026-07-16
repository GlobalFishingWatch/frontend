export const DEFAULT_LABELS = {
  bookmark: {
    deleteBookmark: 'Delete time range bookmark',
    goToBookmark: 'Go to your bookmarked time range',
  },
  intervals: {
    day: 'days',
    hour: 'hours',
    month: 'months',
    year: 'years',
  },
  dragLabel: 'Drag to change the time range',
  zoomTo: 'Zoom to',
  playback: {
    changeAnimationSpeed: 'Change animation speed',
    moveBack: 'Move back',
    moveForward: 'Move forward',
    pauseAnimation: 'Pause animation',
    playAnimation: 'Play animation',
    toogleAnimationLooping: 'Toggle animation looping',
  },
  setBookmark: 'Bookmark current time range',
  timerange: {
    day: 'day',
    done: 'done',
    end: 'end',
    endBeforeStart: 'The end needs to be after the start',
    last30days: 'Last 30 days',
    last3months: 'Last 3 months',
    last6months: 'Last 6 months',
    lastYear: 'Last year',
    month: 'month',
    selectAValidDate: 'Please select a valid date',
    start: 'start',
    title: 'Select a time range',
    tooLongForDays: 'Your timerange is too long to see individual days',
    tooLongForMonths: 'Your timerange is too long to see individual months',
    year: 'year',
  },
}

export type TimebarLabels = typeof DEFAULT_LABELS
