import type { Ref } from 'react'
import { forwardRef } from 'react'

import { getDatasetLabel, GFW_ONLY_SUFFIX } from 'features/datasets/datasets.utils'
import GFWOnly from 'features/user/GFWOnly'

type DatasetLabelProps = { dataset?: { id: string; name?: string } }
function DatasetLabel({ dataset }: DatasetLabelProps, ref: Ref<HTMLSpanElement>) {
  const label = getDatasetLabel(dataset)
  if (label.endsWith(GFW_ONLY_SUFFIX))
    return (
      <span ref={ref}>
        <GFWOnly type="only-icon" />
        {label.replace(GFW_ONLY_SUFFIX, '')}
      </span>
    )
  return <span>{label}</span>
}

export default forwardRef(DatasetLabel)
