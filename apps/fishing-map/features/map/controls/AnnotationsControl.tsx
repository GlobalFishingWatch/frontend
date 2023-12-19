import { useCallback } from 'react'
import { useSelector, batch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import { setRulersEditing } from 'features/map/rulers/rulers.slice'
import useRulers from 'features/map/rulers/rulers.hooks'
import useMapInstance from '../map-context.hooks'
import { selectIsMapAnnotating, toggleMapAnnotating } from '../annotations/annotations.slice'

const MapAnnotationsControls = () => {
  const { t } = useTranslation()
  const isAnnotating = useSelector(selectIsMapAnnotating)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { setMapAnnotating, resetMapAnnotation } = useMapAnnotation()
  const { rulersEditing } = useRulers()
  const {
    mapAnnotations,
    areMapAnnotationsVisible,
    cleanMapAnnotations,
    toggleMapAnnotationsVisibility,
  } = useMapAnnotations()

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    if (rulersEditing) {
      dispatch(setRulersEditing(false))
    }
    dispatch(toggleMapAnnotating())
    if (isAnnotating) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, dispatch, isAnnotating, rulersEditing])

  const onRemoveClick = useCallback(() => {
    batch(() => {
      resetMapAnnotation()
      setMapAnnotating(false)
      cleanMapAnnotations()
    })
  }, [cleanMapAnnotations, resetMapAnnotation, setMapAnnotating])

  return (
    <MapControlGroup
      icon="annotation"
      active={isAnnotating}
      visible={areMapAnnotationsVisible}
      expanded={mapAnnotations?.length > 0}
      editTooltip={
        isAnnotating
          ? t('map.annotationsStop', 'Stop editing annotations')
          : t('map.annotationsAdd', 'Add annotation')
      }
      deleteTooltip={t('map.annotationsDelete', 'Delete all annotations')}
      onClick={onToggleClick}
      onVisibilityClick={toggleMapAnnotationsVisibility}
      onDeleteClick={onRemoveClick}
    />
  )
}

export default MapAnnotationsControls
