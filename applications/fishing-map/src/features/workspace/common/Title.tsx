import cx from 'classnames'
import { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'
import { useDataviewInstancesConnect } from '../workspace.hook'

type TitleProps = {
  dataview: UrlDataviewInstance
  className: string
  classNameActive: string
  title: string
}

const Title = ({ dataview, className, classNameActive, title }: TitleProps) => {
  const { upsertDataviewInstance } = useDataviewInstancesConnect()
  const layerActive = dataview?.config?.visible ?? true
  const onToggleLayerActive = () => {
    upsertDataviewInstance({
      id: dataview.id,
      config: {
        visible: !layerActive,
      },
    })
  }
  return (
    <h3 className={cx(className, { [classNameActive]: layerActive })} onClick={onToggleLayerActive}>
      {title}
    </h3>
  )
}

export default Title
