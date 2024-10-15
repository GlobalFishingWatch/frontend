import { useMemo, useState } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Button, Choice, ChoiceOption, IconButton } from '@globalfishingwatch/ui-components'
import {
  KILOMETERS,
  NAUTICAL_MILES,
  DISSOLVE,
  DIFFERENCE,
} from 'features/reports/areas/area-reports.config'
import { BufferOperation, BufferUnit } from 'types'
import { BUFFER_PREVIEW_COLOR } from 'data/config'
import { selectReportPreviewBufferFeature } from 'features/reports/areas/area-reports.selectors'
import styles from './ReportTitle.module.css'

type BufferButonTooltipProps = {
  areaType: 'Point' | 'Polygon' | 'MultiPolygon' | undefined
  activeUnit: BufferUnit
  defaultValue: number
  activeOperation: BufferOperation
  handleRemoveBuffer: () => void
  handleConfirmBuffer: () => void
  handleBufferUnitChange: (option: ChoiceOption<BufferUnit>) => void
  handleBufferValueChange: (values: number[]) => void
  handleBufferOperationChange: (option: ChoiceOption<BufferOperation>) => void
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
  const STEP = 1
  const MIN = -100
  const MAX = 100
  const [values, setValues] = useState([0, defaultValue])
  const previewBuffer = useSelector(selectReportPreviewBufferFeature)
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
        { id: DISSOLVE, label: t('analysis.dissolve', 'dissolve') },
        { id: DIFFERENCE, label: t('analysis.difference', 'difference') },
      ]
    }
  }, [t, values, areaType])

  return (
    <div className={styles.bufferTooltipContent}>
      <div className={styles.actionContainer}>
        <label>{t('common.unit', 'unit')}</label>
        <Choice
          size="tiny"
          activeOption={activeUnit}
          onSelect={handleBufferUnitChange}
          options={bufferUnitOptions}
        />
      </div>
      <div className={styles.actionContainer}>
        <label>{t('common.value', 'value')}</label>
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
                    colors: ['#ccc', BUFFER_PREVIEW_COLOR, '#ccc'],
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
          renderThumb={({ props, index }) => {
            const { key, ...rest } = props
            return (
              <div
                key={key}
                {...rest}
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
            )
          }}
        />
      </div>
      <div className={styles.actionContainer}>
        <label>{t('analysis.bufferOperationLabel', 'Analysis area')}</label>
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
        <Button
          size="small"
          onClick={handleConfirmBuffer}
          disabled={!previewBuffer || negativePointBuffer}
        >
          {t('common.confirm', 'Confirm')}
        </Button>
      </div>
    </div>
  )
}
