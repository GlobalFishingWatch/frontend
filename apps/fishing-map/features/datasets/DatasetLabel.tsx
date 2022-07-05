import { forwardRef, Ref } from 'react'
import { getDatasetLabel, GFW_ONLY_SUFFIX } from 'features/datasets/datasets.utils'
import GFWOnly from 'features/user/GFWOnly'

function DatasetLabel(
  { dataset }: { dataset: { id: string; name?: string } },
  ref: Ref<HTMLSpanElement>
) {
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
