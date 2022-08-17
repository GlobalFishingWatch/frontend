import { setFlagsFromString } from 'v8'
import { Fragment, useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import cx from 'classnames'
import { redirect } from 'redux-first-router'
import { useDispatch, useSelector } from 'react-redux'
import { Button, IconButton, InputDate } from '@globalfishingwatch/ui-components'
import { Locale } from 'types'
import { REPORT } from 'routes/routes'
import { selectCurrentUserProfileHasInsurerPermission } from '../profile.selectors'
import styles from './ReportFilter.module.css'

interface ReportFilterOptions {
  vesselProfileId: string
  akaVesselProfileIds?: string[]
}

const ReportFilter: React.FC<ReportFilterOptions> = (props) => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const from = new Date()
  from.setFullYear(from.getFullYear() - 1)
  const [start, setStart] = useState(from)
  const [end, setEnd] = useState(new Date())
  const currentProfileIsInsurer = useSelector(selectCurrentUserProfileHasInsurerPermission)

  const differenceInDays = useMemo(() => {
    const differenceInTime = end.getTime() - start.getTime();
    // To calculate the no. of days between two dates
    return differenceInTime / (1000 * 3600 * 24);
  }, [start, end])

  const openVesselProfile = useCallback(
    () => {
      let [dataset, gfwId, tmtId] = (
        Array.from(new URLSearchParams(props.vesselProfileId).keys()).shift() ?? ''
      ).split('_')

      if (!currentProfileIsInsurer || differenceInDays <= 365) {
        dispatch(
          redirect({
            type: REPORT,
            payload: {
              dataset: dataset,
              vesselID: gfwId,
              tmtID: tmtId,
              start: start.toISOString().split('T')[0],
              end: end.toISOString().split('T')[0],
            },
            query: {
              aka: props.akaVesselProfileIds,
            }
          })
        )
      }
    },
    [dispatch, props, start, end, currentProfileIsInsurer, differenceInDays]
  )
  return (
    <Fragment>
      <IconButton icon="download" type="default" size="default" className={styles.button} onClick={() => setOpen(!open)}>
      </IconButton>
      {open && (
        <ul className={styles.list}>
          <li>

            <InputDate
              value={start.toISOString()}
              className={styles.full}

              label={t('common.from', 'From')}
              onChange={(e) => {
                setStart(new Date(e.target.value))
              }}
              onRemove={(e) => {

              }}
            />
          </li>
          <li>

            <InputDate
              value={end.toISOString()}
              className={styles.full}
              label={t('common.to', 'To')}
              onChange={(e) => {
                setEnd(new Date(e.target.value))
              }}
              onRemove={(e) => {

              }}
            />
          </li>
          {currentProfileIsInsurer && differenceInDays > 365 &&
            <li>For insurers, this is a maximum of one year.</li>
          }
          <li className={styles.buttons}>
            <Button size='small' onClick={openVesselProfile} >Generate</Button>
          </li>
        </ul>
      )}
    </Fragment >
  )
}

export default ReportFilter
