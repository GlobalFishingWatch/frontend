import React, { Fragment, useState } from 'react'
import Tag from '@globalfishingwatch/ui-components/src/tag'
import TagList, { TagItem, TagListOnRemove } from '@globalfishingwatch/ui-components/src/tag-list'

const TagsSection = () => {
  const [tags, setTags] = useState<TagItem[]>([
    {
      id: 'RUS',
      label: 'Russia',
    },
    {
      id: 'JPN',
      label: 'Japan',
    },
    {
      id: 'CHN',
      label: 'China',
    },
    {
      id: 'PRT',
      label: 'Portugal',
    },
  ])
  const onRemoveTag: TagListOnRemove = (tag, currentTags) => {
    console.log('Removed', tag)
    setTags(currentTags)
  }

  return (
    <Fragment>
      <label>Default</label>
      <Tag>Argentina</Tag>
      <Tag onRemove={(e) => console.log(e)}>Panama</Tag>
      <label>Custom Color</label>
      <Tag onRemove={(e) => console.log(e)} color={'#ff0000'}>
        Chile
      </Tag>
      <label>Tag list</label>
      <TagList color={'#ff0000'} options={tags} onRemove={onRemoveTag} />
    </Fragment>
  )
}

export default TagsSection
