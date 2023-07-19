import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Fragment } from 'react'
import { Range, getTrackBackground } from 'react-range'
import { Button, Icon, Choice } from '@globalfishingwatch/ui-components'
import { ContextLayerType, GeneratorType } from '@globalfishingwatch/layer-composer'
import { Area } from 'features/areas/areas.slice'
import { selectReportAreaDataview } from 'features/reports/reports.selectors'
import { getContextAreaLink } from 'features/dataviews/dataviews.utils'
import ReportTitlePlaceholder from 'features/reports/placeholders/ReportTitlePlaceholder'
import { TrackCategory, trackEvent } from 'features/app/analytics.hooks'
import { selectCurrentReport } from 'features/app/app.selectors'
import styles from './ReportTitle.module.css'

type ReportTitleProps = {
  area: Area
  description?: string
  infoLink?: string
}

const BufferTooltip = () => {
  const STEP = 0.1
  const MIN = -100
  const MAX = 100
  const [values, setValues] = useState([0, 50])
  return (
    <div className={styles.bufferTooltipContent}>
      <Choice
        size="tiny"
        activeOption="miles"
        options={[
          { id: 'miles', label: 'Nautical miles' },
          { id: 'kilometers', label: 'kilometers' },
        ]}
      />
      <Range
        allowOverlap
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        onChange={setValues}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
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
            }}
          >
            {index === 1 ? values[index].toFixed(0) : null}
          </div>
        )}
      />
      <Button size="small">confirm</Button>
    </div>
  )
}

export default function ReportTitle({ area }: ReportTitleProps) {
  const { t } = useTranslation()
  const areaDataview = useSelector(selectReportAreaDataview)
  const report = useSelector(selectCurrentReport)
  const reportLink = window.location.href
  const name = report
    ? report.name
    : areaDataview?.config?.type === GeneratorType.UserContext
    ? areaDataview?.datasets?.[0]?.name
    : area?.name
  const linkHref = getContextAreaLink(
    areaDataview?.config?.layers?.[0]?.id as ContextLayerType,
    area
  )
  const onPrintClick = () => {
    trackEvent({
      category: TrackCategory.Analysis,
      action: `Click print/save as pdf`,
    })
    window.print()
  }
  return (
    <div className={styles.container}>
      {name ? (
        <Fragment>
          <h1 className={styles.title}>{name}</h1>
          <a className={styles.reportLink} href={reportLink}>
            {t('analysis.linkToReport', 'Check the dynamic report here')}
          </a>

          <div className={styles.actions}>
            {linkHref && (
              <a target="_blank" rel="noopener noreferrer" href={linkHref}>
                {/* <IconButton icon="info" tooltip={t('common.learnMore', 'Learn more')} /> */}
                <Button type="border-secondary" size="small" className={styles.actionButton}>
                  <p>{t('common.learnMore', 'Learn more')}</p>
                  <Icon icon="info" type="default" />
                </Button>
              </a>
            )}
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              tooltip={<BufferTooltip />}
              tooltipPlacement="bottom"
              tooltipProps={{
                interactive: true,
                trigger: 'click',
                delay: 0,
                className: styles.bufferContainer,
              }}
            >
              <p>{t('analysis.buffer', 'Buffer Area')}</p>
              <Icon icon="download" type="default" />
            </Button>
            <Button
              type="border-secondary"
              size="small"
              className={styles.actionButton}
              onClick={onPrintClick}
            >
              <p>{t('analysis.print ', 'print')}</p>
              <Icon icon="print" type="default" />
            </Button>
          </div>
        </Fragment>
      ) : (
        <ReportTitlePlaceholder />
      )}
    </div>
  )
}
