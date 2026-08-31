import { useCallback, useEffect, useMemo, useState } from 'react'
import { Slider as AriaSlider, SliderThumb, SliderTrack } from 'react-aria-components/Slider'

import { IconButton } from '../icon-button'
import { InputText } from '../input-text'
import { Popover } from '../popover'

import styles from './MapLegend.module.css'

export type ColorRampBrushRange = [number | undefined, number | undefined]

type ColorRampBrushProps = {
  /** Ramp break values, one per bucket edge, already sliced the same way the labels are */
  domainValues: number[]
  /** Where each domain value sits on the ramp, in percent. Same grid the labels use */
  stepPercents: number[]
  /** Maps a value to its position on the ramp, in percent */
  valueToPercent: (value: number) => number
  range: ColorRampBrushRange
  onChange: (range: ColorRampBrushRange) => void
  label: string
  minLabel: string
  maxLabel: string
  removeLabel: string
}

// The thumbs are driven in percent rather than in bucket indexes so they can rest between two
// breaks. Values are stored as absolute numbers and the ramp is recalculated from the loaded
// data, so after a rescale the stored range no longer lines up with a break, and the thumbs
// need to show where it actually falls. Snapping is applied on interaction only.
const BRUSH_STEP = 0.01

const clampPercent = (percent: number) => Math.min(Math.max(percent, 0), 100)

const parseBound = (value: string) => {
  const trimmed = value.trim()
  return trimmed === '' ? undefined : Number(trimmed)
}

const formatBound = (value?: number) =>
  value === undefined || !Number.isFinite(value) ? undefined : Number(value.toPrecision(12))

export function ColorRampBrush({
  domainValues,
  stepPercents,
  valueToPercent,
  range,
  onChange,
  label,
  minLabel,
  maxLabel,
  removeLabel,
}: ColorRampBrushProps) {
  // Snap targets are the colour cell boundaries: the ramp edges, which mean unbounded, plus one
  // per domain value. Index 0 and the last index are therefore "no bound on that side".
  const snapPercents = useMemo(() => [0, ...stepPercents, 100], [stepPercents])
  const lastSnapIndex = snapPercents.length - 1
  const [draggingPercents, setDraggingPercents] = useState<number[] | undefined>()
  // What was last committed, held until the same range comes back down through props. The
  // commit round trips through the URL, so without this the thumbs snap back to the previous
  // range for a render or two and then jump forward again
  const [pending, setPending] = useState<
    { percents: number[]; range: ColorRampBrushRange } | undefined
  >()
  const [popoverOpen, setPopoverOpen] = useState(false)
  const [draft, setDraft] = useState<[string, string]>(['', ''])

  const percentToIndex = useCallback(
    (percent: number) =>
      snapPercents.reduce(
        (nearest, snap, index) =>
          Math.abs(snap - percent) < Math.abs(snapPercents[nearest] - percent) ? index : nearest,
        0
      ),
    [snapPercents]
  )

  const restingPercents = useMemo(() => {
    const [min, max] = range
    return [
      min === undefined ? 0 : clampPercent(valueToPercent(min)),
      max === undefined ? 100 : clampPercent(valueToPercent(max)),
    ]
  }, [range, valueToPercent])

  useEffect(() => {
    if (pending && pending.range[0] === range[0] && pending.range[1] === range[1]) {
      setPending(undefined)
    }
  }, [pending, range])

  const percents = draggingPercents || pending?.percents || restingPercents

  const commit = useCallback(
    (nextPercents: number[]) => {
      setDraggingPercents(undefined)
      // Keep the thumbs at least one bucket apart, an empty selection would hide everything
      const minIndex = Math.min(percentToIndex(nextPercents[0]), lastSnapIndex - 1)
      const maxIndex = Math.max(percentToIndex(nextPercents[1]), minIndex + 1)
      // A non finite break (the -Infinity first bucket of a divergent ramp) is not a bound.
      // Breaks come out of ckmeans carrying float noise (737.9300000000001), which would end up
      // in the URL and in the popover inputs, so trim it without flattening small magnitudes
      const boundAt = (index: number) => {
        const value = domainValues[index - 1]
        return Number.isFinite(value) ? Number(value.toPrecision(12)) : undefined
      }
      const nextMin = minIndex === 0 ? undefined : boundAt(minIndex)
      const nextMax = maxIndex >= lastSnapIndex ? undefined : boundAt(maxIndex)
      // A click that does not move a thumb should not push a history entry
      if (nextMin === range[0] && nextMax === range[1]) {
        return
      }
      setPending({
        percents: [snapPercents[minIndex], snapPercents[maxIndex]],
        range: [nextMin, nextMax],
      })
      onChange([nextMin, nextMax])
    },
    [domainValues, lastSnapIndex, onChange, percentToIndex, range, snapPercents]
  )

  const onSliderChange = useCallback(
    (nextPercents: number[]) => {
      setDraggingPercents(nextPercents.map((percent) => snapPercents[percentToIndex(percent)]))
    },
    [percentToIndex, snapPercents]
  )

  // Arrow keys have to be handled here: the step is deliberately finer than a bucket so the
  // resting position can be arbitrary, which would otherwise make a key press a no-op.
  // It lives on the wrapper because react aria strips unknown DOM props off SliderThumb, and
  // the thumb index is read off the event target rather than from react aria internals.
  const onThumbKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const offset =
        event.key === 'ArrowLeft' || event.key === 'ArrowDown'
          ? -1
          : event.key === 'ArrowRight' || event.key === 'ArrowUp'
            ? 1
            : 0
      if (!offset) {
        return
      }
      const inputs = [...event.currentTarget.querySelectorAll('input[type="range"]')]
      const thumbIndex = inputs.indexOf(event.target as HTMLInputElement)
      if (thumbIndex < 0) {
        return
      }
      // Capture phase plus stopPropagation, otherwise react aria also nudges the thumb by one
      // BRUSH_STEP and the snap would swallow the move
      event.preventDefault()
      event.stopPropagation()
      const nextIndex = Math.min(
        Math.max(percentToIndex(percents[thumbIndex]) + offset, 0),
        lastSnapIndex
      )
      const nextPercents = [...percents]
      nextPercents[thumbIndex] = snapPercents[nextIndex]
      commit(nextPercents)
    },
    [commit, lastSnapIndex, percentToIndex, percents, snapPercents]
  )

  const [minValue, maxValue] = range
  const hasRange = minValue !== undefined || maxValue !== undefined

  useEffect(() => {
    if (popoverOpen) {
      setDraft([minValue?.toString() ?? '', maxValue?.toString() ?? ''])
    }
  }, [popoverOpen, minValue, maxValue])

  const draftMin = parseBound(draft[0])
  const draftMax = parseBound(draft[1])
  const draftMinInvalid = draftMin !== undefined && isNaN(draftMin)
  const draftMaxInvalid = draftMax !== undefined && isNaN(draftMax)
  const draftInverted =
    !draftMinInvalid && !draftMaxInvalid && draftMin !== undefined && draftMax !== undefined
      ? draftMin >= draftMax
      : false

  // Typed bounds are committed as entered, no snapping, so the ramp breaks stay a shortcut
  // rather than the only reachable values
  const commitDraft = useCallback(() => {
    if (draftMinInvalid || draftMaxInvalid || draftInverted) {
      return
    }
    if (draftMin === minValue && draftMax === maxValue) {
      return
    }
    setPending({
      percents: [
        draftMin === undefined ? 0 : clampPercent(valueToPercent(draftMin)),
        draftMax === undefined ? 100 : clampPercent(valueToPercent(draftMax)),
      ],
      range: [draftMin, draftMax],
    })
    onChange([draftMin, draftMax])
  }, [
    draftInverted,
    draftMax,
    draftMaxInvalid,
    draftMin,
    draftMinInvalid,
    maxValue,
    minValue,
    onChange,
    valueToPercent,
  ])

  const onDraftKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.currentTarget.blur()
    }
  }, [])

  const onRemove = useCallback(() => {
    setPopoverOpen(false)
    onChange([undefined, undefined])
  }, [onChange])

  if (domainValues.length < 2 || stepPercents.length !== domainValues.length) {
    return null
  }

  return (
    <div className={styles.brush} onKeyDownCapture={onThumbKeyDown}>
      <AriaSlider
        className={styles.brushSlider}
        aria-label={label}
        value={percents}
        minValue={0}
        maxValue={100}
        step={BRUSH_STEP}
        onChange={onSliderChange}
        onChangeEnd={commit}
      >
        <SliderTrack className={styles.brushTrack}>
          <span className={styles.brushScrim} style={{ left: 0, width: `${percents[0]}%` }} />
          <span className={styles.brushScrim} style={{ left: `${percents[1]}%`, right: 0 }} />
          <SliderThumb index={0} aria-label={minLabel} className={styles.brushThumb} />
          <SliderThumb index={1} aria-label={maxLabel} className={styles.brushThumb} />
        </SliderTrack>
      </AriaSlider>
      {hasRange && (
        <Popover
          placement="bottom"
          // The legend sits inside a stacking context (the panel's legend container sets
          // position + z-index), so an inline popover renders under the next layer panel
          portal
          ariaLabel={label}
          open={popoverOpen}
          onOpenChange={setPopoverOpen}
          content={
            <div className={styles.brushPopover}>
              <div className={styles.brushPopoverInputs}>
                <InputText
                  type="number"
                  inputSize="small"
                  label={minLabel}
                  value={draft[0]}
                  invalid={draftMinInvalid || draftInverted}
                  placeholder={formatBound(domainValues[0])?.toString()}
                  onChange={(e) => setDraft([e.target.value, draft[1]])}
                  onBlur={commitDraft}
                  onKeyDown={onDraftKeyDown}
                />
                <InputText
                  type="number"
                  inputSize="small"
                  label={maxLabel}
                  value={draft[1]}
                  invalid={draftMaxInvalid || draftInverted}
                  placeholder={formatBound(domainValues[domainValues.length - 1])?.toString()}
                  onChange={(e) => setDraft([draft[0], e.target.value])}
                  onBlur={commitDraft}
                  onKeyDown={onDraftKeyDown}
                />
              </div>
              <IconButton
                icon="delete"
                size="small"
                tooltip={removeLabel}
                className={styles.brushPopoverRemove}
                onClick={onRemove}
              />
            </div>
          }
        >
          {/* Sits outside the AriaSlider so a click opens the popover instead of the track
              handler yanking the nearest thumb to the pointer */}
          <span
            className={styles.brushSelection}
            role="button"
            tabIndex={0}
            aria-label={label}
            style={{ left: `${percents[0]}%`, width: `${percents[1] - percents[0]}%` }}
          />
        </Popover>
      )}
    </div>
  )
}
