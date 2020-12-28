import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Link from 'redux-first-router-link'
import { fetchGoogleSheetsData } from 'google-sheets-mapper'
import { Spinner } from '@globalfishingwatch/ui-components'
import { selectLocationCategory } from 'routes/routes.selectors'
import { WORKSPACE } from 'routes/routes'
import styles from './WorkspacesList.module.css'

type ViewData = {
  title: string
  description: string
  img: string
  cta: string
  workspace: string
}

function WorkspacesList() {
  const locationCategory = useSelector(selectLocationCategory)
  const userFriendlyCategory = locationCategory.replace('-', ' ')
  const [viewsData, setViewsData] = useState<ViewData[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setViewsData([])
      try {
        await fetchGoogleSheetsData({
          apiKey: process.env.REACT_APP_GOOGLE_API_KEY as string,
          sheetId: process.env.REACT_APP_GOOGLE_SHEETS_ID as string,
          sheetsNames: [locationCategory],
        }).then((response) => {
          setViewsData(response[0].data as ViewData[])
        })
      } catch (error) {
        console.warn(error)
      }
    }
    fetchData()
  }, [locationCategory])

  return (
    <div className={styles.container}>
      <label>{userFriendlyCategory}</label>
      {viewsData.length === 0 ? (
        <Spinner size="small" />
      ) : (
        <ul>
          {viewsData.map((view) => {
            return (
              <li className={styles.workspace} key={view.title}>
                <img className={styles.image} alt={view.title} src={view.img} />
                <div className={styles.info}>
                  <h3 className={styles.title}>{view.title}</h3>
                  <p className={styles.description}>{view.description}</p>
                  <Link
                    className={styles.link}
                    to={{
                      type: WORKSPACE,
                      payload: {
                        category: locationCategory,
                        workspaceId: view.workspace,
                      },
                      query: {},
                    }}
                  >
                    {view.cta}
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
export default WorkspacesList
