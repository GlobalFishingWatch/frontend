import React, { Fragment, useCallback, useMemo } from 'react'
import cx from 'classnames'
import { scaleLinear } from 'd3-scale'

import type { ColorRampBrushConfig } from './ColorRampBrush'
import { ColorRampBrush } from './ColorRampBrush'
import {
  formatLegendValue,
  parseLegendNumber,
  roundLegendDecimals,
  roundLegendNumber,
  SCIENTIFIC_NOTATION_E,
} from './map-legend.utils'
import type { UILegendColorRamp } from './types'

import styles from './MapLegend.module.css'

type PercentScale = ((value: number) => number) | null

const toPercent = (scale: PercentScale, value: number) => {
  const scaled = scale?.(value) as number
  return isNaN(scaled) || scaled < 0 ? 0 : scaled
}

type ColorRampLegendProps = {
  layer: UILegendColorRamp
  className?: string
  roundValues?: boolean
  currentValueClassName?: string
  labelComponent?: React.ReactNode
  brush?: ColorRampBrushConfig
}

export function ColorRampLegend({
  layer = {} as UILegendColorRamp,
  className = '',
  roundValues = true,
  currentValueClassName = '',
  labelComponent = null,
  brush,
}: ColorRampLegendProps) {
  const { gridArea, values, colors, loading, label, unit, currentValue, type, gradient } = layer
  // Omit bucket that goes from -Infinity --> 0 on non-divergent scales.
  const omitFirstBucket = !layer.divergent

  const domainValues = useMemo(
    () => (omitFirstBucket ? values?.slice(1) : values),
    [omitFirstBucket, values]
  )
  const cleanValues = values?.filter((value) => value)
  const skipOddLabels = cleanValues && cleanValues.length >= 6 && !layer.divergent

  const stepPercents = useMemo(() => {
    if (!domainValues?.length) return []
    const isDiscrete = type === 'colorramp-discrete' && !!colors?.length
    return domainValues.map((_, i) =>
      isDiscrete ? ((i + 1) * 100) / colors.length : (i * 100) / domainValues.length
    )
  }, [domainValues, colors, type])

  const rampScale = useMemo(() => {
    if (!domainValues?.length || !stepPercents.length) return null

    // Reuse d3 logic when values go beyond max value
    const adjustedDomain = [...domainValues] as number[]
    if (adjustedDomain[0] === -Infinity) {
      adjustedDomain[0] = adjustedDomain[1] + adjustedDomain[2]
    }
    return scaleLinear().domain(adjustedDomain).range(stepPercents)
  }, [domainValues, stepPercents])

  const valueToPercent = useCallback((value: number) => toPercent(rampScale, value), [rampScale])

  // Outliers are clipped out of the steps, so the last one stops well short of the ramp end. The
  // brush runs its last stretch up to the max bound, or to the data max, instead of extrapolating
  // the last bucket: otherwise the values past the last step are out of reach and the resting
  // inset handle jumps straight from that step to the bound. Without an extent the handle is not
  // inset, and 100% means "no bound", so the bound cannot sit there
  const brushTop = brush?.extent ? (brush.range[1] ?? brush.extent[1]) : undefined
  const brushScale = useMemo(() => {
    if (!rampScale) return null
    let domain = rampScale.domain() as number[]
    let range = rampScale.range() as number[]
    if (
      brushTop !== undefined &&
      brushTop > (domain.at(-1) as number) &&
      (range.at(-1) as number) < 100
    ) {
      domain = [...domain, brushTop]
      range = [...range, 100]
    }
    const firstValue = values?.[0] as number
    const floor = omitFirstBucket && Number.isFinite(firstValue) ? firstValue : 0
    return range[0] === 0
      ? scaleLinear().domain(domain).range(range)
      : scaleLinear()
          .domain([floor, ...domain])
          .range([0, ...range])
  }, [rampScale, omitFirstBucket, values, brushTop])

  const brushValueToPercent = useCallback(
    (value: number) => toPercent(brushScale, value),
    [brushScale]
  )

  const percentToValue = useCallback(
    (percent: number) => {
      const value = brushScale?.invert(percent) as number
      return isNaN(value) ? 0 : value
    },
    [brushScale]
  )

  const backgroundStyle = useMemo(() => {
    if (!colors?.length) return {}
    if (type !== 'colorramp-discrete') {
      return {
        backgroundImage: `linear-gradient(to right, ${colors?.map((color) => color).join()})`,
      }
    }
    if (!gradient) return {}
    const stops = colors.map((color, i) => `${color} ${(i * 100) / colors.length}%`)
    return {
      backgroundImage: `linear-gradient(to right, ${[...stops, `${colors[colors.length - 1]} 100%`].join()})`,
    }
  }, [colors, type, gradient])

  const inset: [boolean, boolean] = [
    !!brush?.extent && brush.range[0] !== undefined,
    !!brush?.extent && brush.range[1] !== undefined,
  ]
  const insetClassName = { [styles.insetStart]: inset[0], [styles.insetEnd]: inset[1] }

  const Label = labelComponent ? (
    labelComponent
  ) : (
    <p>
      {label && label}
      {unit && (
        <span className={styles.subTitle}>
          {' '}
          ({unit}
          {gridArea && <span> / {gridArea}</span>})
        </span>
      )}
    </p>
  )

  if (loading && colors && type === 'colorramp-discrete') {
    return (
      <div className={cx(styles.row, className)}>
        {Label}
        <div className={styles.ramp} style={backgroundStyle}>
          <div className={styles.discreteSteps}>
            {colors.map((color: string, i: number) =>
              i > 0 ? (
                <span className={styles.discreteStep} key={i} style={{ backgroundColor: color }} />
              ) : null
            )}
          </div>
        </div>
        <div className={cx(styles.stepsContainer)}>
          {colors.map((_: string, i: number) => {
            if (skipOddLabels && i !== 0 && i !== domainValues?.length && i % 2 === 1) return null
            return (
              <span
                className={cx(styles.step, {
                  [styles.lastStep]: !skipOddLabels && i === colors.length - 1,
                })}
                style={{ left: `${(i * 100) / (colors.length - 1)}%` }}
                key={i}
              >
                <span className={styles.loading}>
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                </span>
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  if (!domainValues || !colors?.length) {
    return null
  }

  const brushLabels = (() => {
    if (!brush || !rampScale || layer.divergent) return undefined
    const steps = domainValues
      .map((value, i) => ({ value: value as number, percent: stepPercents[i] as number }))
      .filter(({ value }) => typeof value === 'number' && Number.isFinite(value))
    if (!steps.length) return undefined
    const last = steps.length - 1
    const [min, max] = brush.range
    const start = inset[0] ? -1 : 0
    const end = inset[1] ? last + 1 : last
    const span = end - start
    const gaps = [5, 4, 3].find((count) => span % count === 0) ?? 4
    const indexes = [
      ...new Set(Array.from({ length: gaps + 1 }, (_, k) => start + Math.round((k * span) / gaps))),
    ]
    return indexes.map((i) => {
      if (i < 0) return { value: min as number, percent: 0, isLast: false }
      if (i > last) return { value: max as number, percent: 100, isLast: false }
      return { ...(steps[i] as { value: number; percent: number }), isLast: i === last }
    })
  })()

  const getValueLabel = (valueLabel: string) => {
    if (!valueLabel.includes(SCIENTIFIC_NOTATION_E)) return valueLabel
    const numParts = valueLabel.split(SCIENTIFIC_NOTATION_E)
    return (
      <span>
        {numParts[0]}
        {SCIENTIFIC_NOTATION_E}
        <sup className={styles.sup}>{numParts[1]}</sup>
      </span>
    )
  }

  return (
    <div className={cx(styles.row, className)}>
      {Label}
      {domainValues?.length > 0 && (
        <Fragment>
          <div className={cx(styles.ramp, insetClassName)} style={backgroundStyle}>
            {currentValue !== null && currentValue !== undefined && rampScale && (
              <span
                className={cx(styles.currentValue, currentValueClassName, {
                  [styles.offsetLeft]: valueToPercent(currentValue as number) < 10,
                  [styles.offsetRight]: valueToPercent(currentValue as number) > 90,
                })}
                style={{
                  left: `${Math.min(valueToPercent(currentValue as number), 100)}%`,
                }}
              >
                {formatLegendValue({
                  number: currentValue as number,
                  roundValues,
                  isFirst: false,
                  isLast: false,
                  divergent: layer.divergent,
                })}
              </span>
            )}
            {type === 'colorramp-discrete' && !gradient && (
              <div className={styles.discreteSteps}>
                {colors.map((color, i) => (
                  <span
                    className={styles.discreteStep}
                    key={i}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
            {brush && rampScale && !layer.divergent && (
              <ColorRampBrush
                key={layer.id}
                {...brush}
                valueToPercent={brushValueToPercent}
                percentToValue={percentToValue}
                formatValue={(value) => formatLegendValue({ number: value, roundValues }) as string}
                roundValue={roundValues ? roundLegendNumber : roundLegendDecimals}
                inset={inset}
                gradientStyle={backgroundStyle}
              />
            )}
          </div>
          <div className={cx(styles.stepsContainer, insetClassName)}>
            {brushLabels?.map(({ value, percent, isLast }, i) => (
              <span className={styles.step} style={{ left: `${percent}%` }} key={i}>
                {getValueLabel(
                  formatLegendValue({
                    number: roundValues ? roundLegendNumber(value) : parseLegendNumber(value),
                    roundValues,
                    isLast,
                  }) as string
                )}
              </span>
            ))}
            {!brushLabels &&
              domainValues.map((value, i) => {
                if (value === null || value === undefined || value === -Infinity) return null
                const roundValue = roundValues
                  ? roundLegendNumber(value as number)
                  : parseLegendNumber(value as number)
                const valueLabel =
                  typeof value === 'string'
                    ? value
                    : formatLegendValue({
                        number: roundValue,
                        roundValues,
                        isFirst: (omitFirstBucket && i === 0) || (!omitFirstBucket && i === 1),
                        isLast: i === domainValues.length - 1,
                        divergent: layer.divergent,
                      })

                if (skipOddLabels && i !== 0 && i !== values?.length && i % 2 === 1) return null
                return (
                  <span
                    className={cx(styles.step, {
                      [styles.firstStep]: omitFirstBucket && i === 0,
                      [styles.lastStep]:
                        !skipOddLabels && !layer.divergent && i === domainValues.length - 1,
                    })}
                    style={{ left: `${stepPercents[i]}%` }}
                    key={i}
                  >
                    {getValueLabel(valueLabel)}
                  </span>
                )
              })}
          </div>
        </Fragment>
      )}
    </div>
  )
}
