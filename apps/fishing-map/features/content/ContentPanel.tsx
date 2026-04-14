import { useMemo, useState } from 'react'
import cx from 'classnames'

import ContentHeader from 'features/content/ContentHeader'
import type { TDataset, TUserGuideSection } from 'features/content/strapi.types'
import TableOfContents from 'features/content/TableOfContents'
import { Route } from 'routes/_app'
import { htmlSafeParse } from 'utils/html-parser'

import styles from './ContentPanel.module.css'

type UserGuideContentProps = { data: TUserGuideSection[] }

const UserGuideContent = ({ data }: UserGuideContentProps) => {
  const [isTableOfContentsOpen, setIsTableOfContentsOpen] = useState(false)
  const listItems = useMemo(
    () =>
      data.map((section) => ({
        id: section.documentId,
        label: section.title,
      })),
    [data]
  )

  return (
    <div className={cx(styles.container, { [styles.userGuideBackground]: !isTableOfContentsOpen })}>
      <div className={cx(styles.header)}>
        <ContentHeader
          openTableOfContents={() => setIsTableOfContentsOpen(!isTableOfContentsOpen)}
        />
      </div>
      <div className={cx(styles.scrollContainer)}>
        {isTableOfContentsOpen ? (
          <TableOfContents listItems={listItems} />
        ) : (
          <div className={cx(styles.content)}>
            <h2>{data[0].title}</h2>
            {data.map((section) => section.contentBlocks.map((block) => htmlSafeParse(block.body)))}
          </div>
        )}
      </div>
    </div>
  )
}

function ContentPanel() {
  const { data } = Route.useLoaderData()
  const { sidePanelContent } = Route.useSearch()

  return sidePanelContent === 'userGuide' ? (
    <UserGuideContent data={data as TUserGuideSection[]} />
  ) : (
    <div className={cx(styles.container)}>
      <div className={cx(styles.header)}>
        <ContentHeader title={(data[0] as TDataset).name} />
      </div>
      <div className={cx(styles.scrollContainer)}>
        <div className={cx(styles.content)}>{htmlSafeParse((data[0] as TDataset).description)}</div>
      </div>
      <div className={cx(styles.userGuideBackground)}></div>
    </div>
  )
}

export default ContentPanel
