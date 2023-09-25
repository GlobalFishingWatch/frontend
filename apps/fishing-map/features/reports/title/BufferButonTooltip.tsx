import { useMemo, useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { useTranslation } from 'react-i18next'
import { Button, Choice, ChoiceOption, IconButton } from '@globalfishingwatch/ui-components'
import { KILOMETERS, NAUTICAL_MILES, DISSOLVE, DIFFERENCE } from 'features/reports/reports.config'
import { BufferOperation, BufferUnit } from 'types'
import styles from './ReportTitle.module.css'

type BufferButonTooltipProps = {
  areaType: 'Point' | 'Polygon' | 'MultiPolygon' | undefined
  activeUnit: BufferUnit
  defaultValue: number
  activeOperation: BufferOperation
  handleRemoveBuffer: () => void
  handleConfirmBuffer: () => void
  handleBufferUnitChange: (option: { id: string; label: string }) => void
  handleBufferValueChange: (values: number[]) => void
  handleBufferOperationChange: (option: { id: BufferOperation; label: string }) => void
}

export const BufferButtonTooltip = ({
  areaType,
  activeUnit,
  defaultValue,
  activeOperation,
  handleRemoveBuffer,
  handleConfirmBuffer,
  handleBufferUnitChange,
  handleBufferValueChange,
  handleBufferOperationChange,
}: BufferButonTooltipProps) => {
  const { t } = useTranslation()
  const STEP = 0.1
  const MIN = -100
  const MAX = 100
  const [values, setValues] = useState([0, defaultValue])
  const negativePointBuffer = areaType === 'Point' && values[1] <= 0
  const bufferUnitOptions: ChoiceOption<BufferUnit>[] = useMemo(
    () => [
      { id: NAUTICAL_MILES, label: t('analysis.nauticalmiles', 'nautical miles') },
      { id: KILOMETERS, label: t('analysis.kilometers', 'kilometers') },
    ],
    [t]
  )
  const bufferOperationOptions: ChoiceOption<BufferOperation>[] = useMemo(() => {
    if (values[1] <= 0 || areaType === 'Point') {
      return [{ id: DISSOLVE, label: t('analysis.buffer', 'Buffer area') }]
    } else {
      return [
        { id: DISSOLVE, label: t('analysis.dissolve', 'combined') },
        { id: DIFFERENCE, label: t('analysis.difference', 'buffer only') },
      ]
    }
  }, [t, values, areaType])

  return (
    <div className={styles.bufferTooltipContent}>
      <div className={styles.actionContainer}>
        <p className={styles.actionLabel}>unit</p>
        <Choice
          size="tiny"
          activeOption={activeUnit}
          onSelect={handleBufferUnitChange}
          options={bufferUnitOptions}
        />
      </div>
      <div className={styles.actionContainer}>
        <p className={styles.actionLabel}>value</p>
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
      </div>
      <div className={styles.actionContainer}>
        <p className={styles.actionLabel}>{t('analysis.bufferOperationLabel', 'Analysis area')}</p>
        <Choice
          size="tiny"
          className={styles.operationChoice}
          activeOption={activeOperation}
          onSelect={handleBufferOperationChange}
          options={bufferOperationOptions}
        />
      </div>
      <div data-tippy-arrow className={styles.tooltipArrow}></div>
      <div className={styles.confirmationContainer}>
        <IconButton
          type="border"
          icon="delete"
          tooltip={t('analysis.deleteBuffer', 'Delete current buffer')}
          size="small"
          onClick={handleRemoveBuffer}
          disabled={areaType === 'Point'}
        />
        <Button size="small" onClick={handleConfirmBuffer} disabled={negativePointBuffer}>
          {t('common.confirm', 'Confirm')}
        </Button>
      </div>
    </div>
  )
}
