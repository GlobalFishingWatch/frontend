import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getTrackBackground, Range } from 'react-range'

import { deckToHexColor } from '@globalfishingwatch/deck-layers'
import { Button, Icon, IconButton, Popover } from '@globalfishingwatch/ui-components'

import { HOTSPOT_COLOR } from 'features/map/map.config'
import { useHotspotSettings } from 'features/reports/reports-hotspot.hooks'
import { formatArea } from 'features/reports/reports-hotspot.utils'

import styles from './ReportHotspotControls.module.css'

const MIN_AREA = 1000
const MAX_AREA = 500000
const STEP = 100

export default function ReportHotspotControls() {
  const { t } = useTranslation()
  const { enabled, maxAreaKm2, toggle, setMaxAreaKm2 } = useHotspotSettings()
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState([maxAreaKm2])

  const handleRemove = () => {
    toggle(false)
    setOpen(false)
  }

  const handleButtonClick = () => {
    if (!enabled) {
      toggle(true)
    }
    setOpen((v) => !v)
  }

  const handleClickOutside = () => setOpen(false)

  return (
    <Popover
      open={open}
      onClickOutside={handleClickOutside}
      placement="bottom"
      className={styles.popover}
      content={
        <div className={styles.popoverContent}>
          <div className={styles.popoverHeader}>
            <label className={styles.sliderLabel}>{t((t) => t.common.area)} (km²)</label>
            {enabled && (
              <IconButton icon="delete" size="small" type="warning" onClick={handleRemove} />
            )}
          </div>
          <Range
            values={values}
            step={STEP}
            min={MIN_AREA}
            max={MAX_AREA}
            onChange={setValues}
            onFinalChange={(vals) => setMaxAreaKm2(vals[0])}
            renderTrack={({ props, children }) => (
              <div style={{ ...props.style, height: '36px', display: 'flex', width: '100%' }}>
                <div
                  ref={props.ref}
                  style={{
                    height: '2px',
                    width: '100%',
                    borderRadius: '2px',
                    background: getTrackBackground({
                      values,
                      colors: [deckToHexColor(HOTSPOT_COLOR), 'var(--color-terthiary-blue)'],
                      min: MIN_AREA,
                      max: MAX_AREA,
                    }),
                    alignSelf: 'center',
                  }}
                >
                  {children}
                </div>
              </div>
            )}
            renderThumb={({ props }) => {
              const { key, ...rest } = props
              return (
                <div
                  key={key}
                  {...rest}
                  style={{
                    ...props.style,
                    height: '30px',
                    width: '30px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    color: deckToHexColor(HOTSPOT_COLOR),
                    boxShadow: '0px 2px 6px #AAA',
                  }}
                >
                  {formatArea(values[0])}
                </div>
              )
            }}
          />
        </div>
      }
    >
      <div>
        <Button
          onClick={handleButtonClick}
          type="border-secondary"
          size="default"
          className={styles.actionButton}
        >
          {t((t) => t.analysis.hotspot.title)}

          <Icon icon="target" type="default" />
        </Button>
      </div>
    </Popover>
  )
}
