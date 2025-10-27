import { IconButton } from '@globalfishingwatch/ui-components'

import LanguageToggle from '../i18n/LanguageToggle'

export const OptionsMenu = () => {
  return (
    <div className="flex between">
      {/* <IconButton icon="language" /> */}
      <LanguageToggle />
      <IconButton icon="help" />
      <IconButton icon="feedback" onClick={() => console.log('Feedback clicked')} />
    </div>
  )
}

export default OptionsMenu
