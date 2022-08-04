import { Fragment, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { event as uaEvent } from 'react-ga'
import cx from 'classnames'
import { redirect } from 'redux-first-router'
import { useDispatch } from 'react-redux'
import { Button, IconButton, InputDate } from '@globalfishingwatch/ui-components'
import { Locale } from 'types'
import { REPORT } from 'routes/routes'
import styles from './ReportFilter.module.css'

interface ReportFilterOptions {
  vesselProfileId: string
  akaVesselProfileIds?: string[]
}

const ReportFilter: React.FC<ReportFilterOptions> = (props) => {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const openVesselProfile = useCallback(
    () => {
      let [dataset, gfwId, tmtId] = (
        Array.from(new URLSearchParams(props.vesselProfileId).keys()).shift() ?? ''
      ).split('_')

      dispatch(
        redirect({
          type: REPORT,
          payload: {
            dataset: dataset,
            vesselID: gfwId,
            tmtID: tmtId,
            start: '2015-05-30',
            end: '2018-05-30',
          },
          query: {
            aka: props.akaVesselProfileIds,
          }
        })
      )
    },
    [dispatch, props]
  )
  return (
    <Fragment>
      <IconButton icon="download" type="default" size="default" className={styles.button} onClick={() => setOpen(true)}>
      </IconButton>
      {open && (
        <ul className={styles.list}>
          <li>

            <InputDate
              value={''}
              className={styles.full}

              label={t('common.from', 'From')}
              onChange={(e) => {

              }}
              onRemove={(e) => {

              }}
            />
          </li>
          <li>

            <InputDate
              value={''}
              className={styles.full}
              label={t('common.to', 'To')}
              onChange={(e) => {

              }}
              onRemove={(e) => {

              }}
            />
          </li>
          <li className={styles.buttons}>
            <Button type="secondary" onClick={() => setOpen(false)}>X</Button>

            <Button onClick={openVesselProfile} >Generate</Button>
          </li>
        </ul>
      )}
    </Fragment >
  )
}

export default ReportFilter
