import { useCallback } from 'react'
import { useSelector, batch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useAppDispatch } from 'features/app/app.hooks'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import { setRulersEditing } from 'features/map/rulers/rulers.slice'
import useMapInstance from '../map-context.hooks'
import { selectIsMapAnnotating, toggleMapAnnotating } from '../annotations/annotations.slice'

const MapAnnotationsControls = () => {
  const { t } = useTranslation()
  const isAnnotating = useSelector(selectIsMapAnnotating)
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { resetMapAnnotation } = useMapAnnotation()
  const {
    mapAnnotations,
    areMapAnnotationsVisible,
    cleanMapAnnotations,
    toggleMapAnnotationsVisibility,
  } = useMapAnnotations()

  const dispatch = useAppDispatch()
  const onToggleClick = useCallback(() => {
    dispatch(setRulersEditing(false))
    dispatch(toggleMapAnnotating())
    if (isAnnotating) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, dispatch, isAnnotating])

  const onRemoveClick = useCallback(() => {
    batch(() => {
      resetMapAnnotation()
      cleanMapAnnotations()
    })
  }, [cleanMapAnnotations, resetMapAnnotation])

  return (
    <MapControlGroup
      icon="annotation"
      active={isAnnotating}
      visible={areMapAnnotationsVisible}
      expanded={mapAnnotations?.length > 0}
      tooltip={
        isAnnotating
          ? t('map.annotationsStop', 'Stop editing annotations')
          : t('map.annotationsAdd', 'Add annotation')
      }
      onClick={onToggleClick}
      onVisibilityClick={toggleMapAnnotationsVisibility}
      onResetClick={onRemoveClick}
    />
  )
}

export default MapAnnotationsControls
