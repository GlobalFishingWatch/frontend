import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import MapControlGroup from 'features/map/controls/MapControlGroup'
import useRulers from 'features/map/overlays/rulers/rulers.hooks'

const Rulers = () => {
  const { t } = useTranslation()
  const {
    rulers,
    editingRuler,
    rulersEditing,
    rulersVisible,
    toggleRulersVisibility,
    toggleRulersEditing,
    resetRulers,
    resetEditingRule,
  } = useRulers()

  const onToggleClick = useCallback(() => {
    if (rulersEditing) {
      if (editingRuler) {
        resetEditingRule()
      }
    }
    toggleRulersEditing()
  }, [editingRuler, resetEditingRule, rulersEditing, toggleRulersEditing])

  return (
    <MapControlGroup
      icon="ruler"
      active={rulersEditing}
      visible={rulersVisible}
      expanded={rulers?.length > 0}
      editTooltip={
        rulersEditing
          ? t('map.rulersStop', 'Stop editing measures')
          : t('map.rulers_add', 'Measure distance')
      }
      deleteTooltip={t('map.rulersDelete', 'Delete all measures')}
      onClick={onToggleClick}
      onVisibilityClick={toggleRulersVisibility}
      onDeleteClick={resetRulers}
    />
  )
}

export default Rulers
