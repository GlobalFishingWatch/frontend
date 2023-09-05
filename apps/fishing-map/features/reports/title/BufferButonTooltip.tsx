import { useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { Button, Choice } from '@globalfishingwatch/ui-components'
import { BUFFER_UNIT_OPTIONS } from 'features/reports/reports.constants'
import styles from './ReportTitle.module.css'
export const BufferButtonTooltip = ({
  handleBufferValueChange,
  defaultValue,
  activeOption,
  handleBufferUnitChange,
  handleConfirmBuffer,
}) => {
  const STEP = 0.1
  const MIN = -100
  const MAX = 100
  const [values, setValues] = useState([0, defaultValue])
  return (
    <div className={styles.bufferTooltipContent}>
      <Choice
        size="tiny"
        activeOption={activeOption}
        onSelect={handleBufferUnitChange}
        options={BUFFER_UNIT_OPTIONS}
      />
      <Range
        allowOverlap
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={setValues}
        onFinalChange={handleBufferValueChange}
        renderTrack={({ props, children }) => (
          <div
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '2px',
                width: '100%',
                borderRadius: '2px',
                background: getTrackBackground({
                  values,
                  colors: ['#ccc', 'red', '#ccc'],
                  min: MIN,
                  max: MAX,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, index }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: index === 1 ? '30px' : '8px',
              width: index === 1 ? '30px' : '3px',
              borderRadius: '50px',
              backgroundColor: index === 1 ? '#FFF' : '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '14px',
              boxShadow: index === 1 ? '0px 2px 6px #AAA' : 'none',
              pointerEvents: index === 1 ? 'auto' : 'none',
            }}
          >
            {index === 1 ? Math.round(values[index]) : null}
          </div>
        )}
      />
      <div data-tippy-arrow className={styles.tooltipArrow}></div>
      <Button size="small" onClick={handleConfirmBuffer}>
        confirm
      </Button>
    </div>
  )
}
