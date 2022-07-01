import { getDatasetLabel, GFW_ONLY_SUFFIX } from 'features/datasets/datasets.utils'
import GFWOnly from 'features/user/GFWOnly'

function DatasetLabel({ dataset }: { dataset: { id: string; name?: string } }) {
  const label = getDatasetLabel(dataset)
  if (label.endsWith(GFW_ONLY_SUFFIX))
    return (
      <span>
        <GFWOnly type="only-icon" />
        {label.replace(GFW_ONLY_SUFFIX, '')}
      </span>
    )
  return <span>{label}</span>
}

export default DatasetLabel
