import { useMemo, useState } from 'react'
import { Slider, SliderThumb, SliderTrack } from 'react-aria-components/Slider'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import type { ChoiceOption } from '@globalfishingwatch/ui-components'
import {
  Button,
  Choice,
  getSliderTrackBackground,
  IconButton,
  InputText,
} from '@globalfishingwatch/ui-components'

import { BUFFER_PREVIEW_COLOR } from 'data/config'
import {
  DIFFERENCE,
  DISSOLVE,
  KILOMETERS,
  NAUTICAL_MILES,
} from 'features/reports/report-area/area-reports.config'
import { selectReportPreviewBufferFeature } from 'features/reports/report-area/area-reports.selectors'
import type { BufferOperation, BufferUnit } from 'types'

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

const STEP = 1
const MIN = -100
const MAX = 100

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
  const minValue = areaType === 'Point' ? 0 : MIN
  const maxValue = MAX
  const [values, setValues] = useState<number[]>([0, defaultValue])
  const previewBuffer = useSelector(selectReportPreviewBufferFeature)
  const bufferUnitOptions: ChoiceOption<BufferUnit>[] = useMemo(
    () => [
      { id: NAUTICAL_MILES, label: t((t) => t.analysis.nauticalmiles) },
      { id: KILOMETERS, label: t((t) => t.analysis.kilometers) },
    ],
    [t]
  )
  const bufferOperationOptions: ChoiceOption<BufferOperation>[] = useMemo(() => {
    if (values[1] <= 0 || areaType === 'Point') {
      return [{ id: DISSOLVE, label: t((t) => t.analysis.buffer) }]
    } else {
      return [
        { id: DISSOLVE, label: t((t) => t.analysis.dissolve) },
        { id: DIFFERENCE, label: t((t) => t.analysis.difference) },
      ]
    }
  }, [t, values, areaType])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value ? [0, Number(e.target.value)] : []
    setValues(values)
    if (values) {
      handleBufferValueChange(values)
    }
  }

  return (
    <div className={styles.bufferTooltipContent}>
      <div className={styles.actionContainer}>
        <label>{t((t) => t.common.unit)}</label>
        <Choice
          size="small"
          activeOption={activeUnit}
          onSelect={handleBufferUnitChange}
          options={bufferUnitOptions}
        />
      </div>
      <div className={styles.actionContainer}>
        <label>{t((t) => t.common.value)}</label>
        <div className={styles.bufferValueControls}>
          <Slider
            aria-label={t((t) => t.common.value)}
            value={[values[1]]}
            step={STEP}
            minValue={minValue}
            maxValue={maxValue}
            onChange={(vals) => setValues([0, Array.isArray(vals) ? vals[0] : vals])}
            onChangeEnd={(vals) =>
              handleBufferValueChange([0, Array.isArray(vals) ? vals[0] : vals])
            }
            style={{ height: '36px', display: 'flex', width: '100%' }}
          >
            <SliderTrack
              style={{
                position: 'relative',
                height: '2px',
                width: '100%',
                borderRadius: '2px',
                background: getSliderTrackBackground({
                  values,
                  colors: ['#ccc', BUFFER_PREVIEW_COLOR, '#ccc'],
                  min: minValue,
                  max: maxValue,
                }),
                alignSelf: 'center',
              }}
            >
              <SliderThumb
                index={0}
                style={{
                  top: '50%',
                  height: '30px',
                  width: '30px',
                  borderRadius: '50px',
                  backgroundColor: '#FFF',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '14px',
                  boxShadow: '0px 2px 6px #AAA',
                  cursor: 'pointer',
                }}
              >
                {Math.round(values[1]) || 0}
              </SliderThumb>
            </SliderTrack>
          </Slider>
          <InputText
            className={styles.bufferValueInput}
            value={values[1]}
            type="number"
            min={minValue}
            max={maxValue}
            onChange={handleInputChange}
            inputSize="medium"
          />
        </div>
      </div>
      <div className={styles.actionContainer}>
        <label>{t((t) => t.analysis.bufferOperationLabel)}</label>
        <Choice
          size="small"
          className={styles.operationChoice}
          activeOption={activeOperation}
          onSelect={handleBufferOperationChange}
          options={bufferOperationOptions}
        />
      </div>
      <div className={styles.confirmationContainer}>
        <IconButton
          type="border"
          icon="delete"
          tooltip={t((t) => t.analysis.deleteBuffer)}
          size="medium"
          onClick={handleRemoveBuffer}
          disabled={areaType === 'Point'}
        />
        <Button
          size="medium"
          onClick={handleConfirmBuffer}
          disabled={!previewBuffer || !values || values[1] < minValue || values[1] > maxValue}
        >
          {t((t) => t.common.confirm)}
        </Button>
      </div>
    </div>
  )
}
