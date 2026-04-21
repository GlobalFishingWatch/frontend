import { useState } from 'react'
import { getTrackBackground, Range } from 'react-range'

import type { LevelsValues } from './TaskImage.utils'

import styles from './TaskImage.module.css'

const THUMB_COLORS = ['#222', '#888', '#fff']

const activeColor = 'rgba(213, 213, 213, 0.8)'
const dimColor = 'rgb(95, 95, 95)'

export function LevelsSlider({
  initialValues,
  onChange,
}: {
  initialValues: LevelsValues
  onChange: (v: LevelsValues) => void
}) {
  const [internal, setInternal] = useState<LevelsValues>(initialValues)

  const handleChange = (v: number[]) => {
    if (v[0] < v[1] && v[1] < v[2]) setInternal(v as LevelsValues)
  }

  const background = getTrackBackground({
    min: 0,
    max: 255,
    values: internal,
    colors: [dimColor, activeColor, activeColor, dimColor],
  })

  return (
    <div className={styles.levelsSlider}>
      <Range
        values={internal}
        min={0}
        max={255}
        step={1}
        allowOverlap={false}
        onChange={handleChange}
        onFinalChange={(v) => onChange(v as LevelsValues)}
        renderTrack={({ props, children }) => (
          <div
            role="button"
            tabIndex={0}
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            className={styles.levelsTrackOuter}
            style={props.style}
          >
            <div ref={props.ref} className={styles.levelsTrack} style={{ background }}>
              {children}
            </div>
          </div>
        )}
        renderThumb={({ index, props }) => (
          <div
            {...props}
            key={props.key}
            className={styles.levelsThumb}
            style={{
              ...props.style,
              background: THUMB_COLORS[index],
              border: index === 2 ? '1px solid #aaa' : '1px solid #fff',
            }}
          >
            <span className={styles.levelsThumbLabel}>{internal[index]}</span>
          </div>
        )}
      />
    </div>
  )
}
