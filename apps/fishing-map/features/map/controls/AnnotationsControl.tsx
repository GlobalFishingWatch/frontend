import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useFeatureState } from '@globalfishingwatch/react-hooks'
import { useMapAnnotation, useMapAnnotations } from 'features/map/annotations/annotations.hooks'
import MapControlGroup from 'features/map/controls/MapControlGroup'
import useMapInstance from '../map-context.hooks'

const MapAnnotationsControls = () => {
  const { t } = useTranslation()
  const { cleanFeatureState } = useFeatureState(useMapInstance())
  const { isMapAnnotating, resetMapAnnotation, setMapAnnotationEdit, toggleMapAnnotationEdit } =
    useMapAnnotation()
  const {
    mapAnnotations,
    areMapAnnotationsVisible,
    cleanMapAnnotations,
    toggleMapAnnotationsVisibility,
  } = useMapAnnotations()

  const onToggleClick = useCallback(() => {
    toggleMapAnnotationEdit()
    if (isMapAnnotating) {
      cleanFeatureState('click')
    }
  }, [cleanFeatureState, isMapAnnotating, toggleMapAnnotationEdit])

  const onRemoveClick = useCallback(() => {
    resetMapAnnotation()
    setMapAnnotationEdit(false)
    cleanMapAnnotations()
  }, [cleanMapAnnotations, resetMapAnnotation, setMapAnnotationEdit])

  return (
    <MapControlGroup
      icon="annotation"
      active={isMapAnnotating}
      visible={areMapAnnotationsVisible}
      expanded={mapAnnotations?.length > 0}
      editTooltip={
        isMapAnnotating
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
