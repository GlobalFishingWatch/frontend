# @globalfishingwatch/timebar

A React-based timeline visualization library that provides interactive time-based data visualization components. This library is specifically designed to display temporal data with features like:

## Installation

```bash
yarn|pnpm add @globalfishingwatch/timebar
```

## Usage

`Timebar` is a compound component: controls and charts are opt-in children. Range is controlled via `start` / `end` props; `onChange` fires on every update (including a `MOUNT` notification on first render).

### Minimal setup

```tsx
import { useState } from 'react'
import { Timebar } from '@globalfishingwatch/timebar'

function App() {
  const [range, setRange] = useState({
    start: '2020-01-01T00:00:00.000Z',
    end: '2020-06-01T00:00:00.000Z',
  })

  return (
    <Timebar
      start={range.start}
      end={range.end}
      absoluteStart="2012-01-01T00:00:00.000Z"
      absoluteEnd="2026-12-31T23:59:59.999Z"
      onChange={({ start, end }) => setRange({ start, end })}
    />
  )
}
```

### Toolbar and playback

```tsx
import { FOURWINGS_INTERVALS_ORDER, getFourwingsInterval } from '@globalfishingwatch/deck-loaders'
import { Timebar } from '@globalfishingwatch/timebar'

<Timebar start={start} end={end} absoluteStart={absoluteStart} absoluteEnd={absoluteEnd} onChange={onChange}
  intervals={FOURWINGS_INTERVALS_ORDER}
  getCurrentInterval={getFourwingsInterval}
  onBookmarkChange={(bookmarkStart, bookmarkEnd) => { /* persist bookmark */ }}
  bookmarkStart={bookmarkStart}
  bookmarkEnd={bookmarkEnd}
>
  <Timebar.Playback />
  <Timebar.ToolbarWrapper>
    <Timebar.TimeRangeSelector />
    <Timebar.Tools.Bookmark />
  </Timebar.ToolbarWrapper>
  <Timebar.IntervalSelector />
</Timebar>
```

### Charts

Place chart components inside `Timebar.Charts.Wrapper`. Built-in charts: `TracksGraph`, `TracksEvents`, `StackedActivity`, `Highlighter`.

```tsx
<Timebar.Charts.Wrapper onMouseMove={(clientX, scale) => {
  if (clientX === null || !scale) return
  setHighlight({
    start: scale(clientX - 10).toISOString(),
    end: scale(clientX + 10).toISOString(),
  })
}}>
  <Timebar.Charts.TracksGraph data={tracksGraphData} steps={steps} />
  <Timebar.Charts.TracksEvents data={events} onEventClick={onEventClick} />
  {highlight && (
    <Timebar.Charts.Highlighter hoverStart={highlight.start} hoverEnd={highlight.end} />
  )}
</Timebar.Charts.Wrapper>
```

### Custom layers (hooks)

Charts and custom overlays can read the d3 scales from context (must be rendered inside `Timebar.Charts.Wrapper`):

```tsx
import { useOuterScale, useTimelineContext } from '@globalfishingwatch/timebar'

function CustomOverlay() {
  const outerScale = useOuterScale()
  const { overallScale } = useTimelineContext()
  const x = outerScale(new Date('2020-03-15'))
  return <div style={{ position: 'absolute', left: x }} />
}
```

### Keyboard navigation

```tsx
import { getTimebarStepByDelta } from '@globalfishingwatch/timebar'

const { start, end } = getTimebarStepByDelta({
  start, end, absoluteStart, deltaMultiplicator: -1, // shift+left
})
```

### `onChange` sources

`onChange` receives `{ start, end, source? }`. `source` identifies what triggered the change (e.g. `SEEK_RELEASE`, `PLAYBACK_FRAME`, `BOOKMARK_SELECT`). See `EVENT_SOURCE` export for the full list.

## Build and publish

```bash
nx build timebar
nx publish timebar
```

## License

MIT
