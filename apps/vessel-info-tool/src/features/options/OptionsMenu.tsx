import { IconButton } from '@globalfishingwatch/ui-components'

export const OptionsMenu = () => {
  return (
    <div className="flex between">
      <IconButton icon="language" />
      <IconButton icon="help" />
      <IconButton icon="feedback" onClick={() => console.log('Feedback clicked')} />
    </div>
  )
}

export default OptionsMenu
