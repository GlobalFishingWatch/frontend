import { Fragment } from 'react'
import ReactHtmlParser from 'react-html-parser'
import { useSelector } from 'react-redux'
import { Dataset } from '@globalfishingwatch/api-types'
import { getDatasetDescriptionTranslated } from 'features/i18n/utils'
import { isGFWUser } from 'features/user/user.slice'
import GFWOnly from 'features/user/GFWOnly'
import styles from './InfoModal.module.css'

export const getDatasetQueriesArray = (dataset) => {
  const rawQueries = dataset?.configuration?.documentation?.queries
  if (!rawQueries) return
  const queries = Array.isArray(rawQueries)
    ? (rawQueries as string[])
    : [rawQueries as unknown as string]
  return queries
}
type InfoModalContentProps = {
  dataset: Dataset
}

const InfoModalContent = ({ dataset }: InfoModalContentProps) => {
  const gfwUser = useSelector(isGFWUser)
  if (!dataset) {
    return null
  }

  const description = getDatasetDescriptionTranslated(dataset)
  const queries = getDatasetQueriesArray(dataset)
  return (
    <Fragment>
      <p className={styles.content}>
        {/**
         * For security reasons, we are only parsing html
         * coming from translated descriptions
         **/}
        {description.length > 0 ? ReactHtmlParser(description) : dataset.description}
      </p>
      {gfwUser && queries?.length > 0 && (
        <div className={styles.content}>
          <h2 className={styles.subtitle}>
            Queries used
            <GFWOnly />
          </h2>
          {queries?.map((query: string, index: number) => (
            <div key={index}>
              <a target="_blank" href={query} rel="noreferrer">
                query {index + 1}
              </a>
            </div>
          ))}
        </div>
      )}
    </Fragment>
  )
}

export default InfoModalContent
