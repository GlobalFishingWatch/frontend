import React, { useMemo } from 'react'
import { Placement } from 'tippy.js'
import cx from 'classnames'
import Tooltip from '../tooltip'
import { ReactComponent as ArrowDown } from '../assets/icons/arrow-down.svg'
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg'
import { ReactComponent as ArrowTop } from '../assets/icons/arrow-top.svg'
import { ReactComponent as Camera } from '../assets/icons/camera.svg'
import { ReactComponent as Close } from '../assets/icons/close.svg'
import { ReactComponent as Compare } from '../assets/icons/compare.svg'
import { ReactComponent as Delete } from '../assets/icons/delete.svg'
import { ReactComponent as Download } from '../assets/icons/download.svg'
import { ReactComponent as Edit } from '../assets/icons/edit.svg'
import { ReactComponent as Email } from '../assets/icons/email.svg'
import { ReactComponent as Graph } from '../assets/icons/graph.svg'
import { ReactComponent as Home } from '../assets/icons/home.svg'
import { ReactComponent as Info } from '../assets/icons/info.svg'
import { ReactComponent as Menu } from '../assets/icons/menu.svg'
import { ReactComponent as Minus } from '../assets/icons/minus.svg'
import { ReactComponent as Plus } from '../assets/icons/plus.svg'
import { ReactComponent as Publish } from '../assets/icons/publish.svg'
import { ReactComponent as RemoveFromMap } from '../assets/icons/remove-from-map.svg'
import { ReactComponent as Ruler } from '../assets/icons/ruler.svg'
import { ReactComponent as Satellite } from '../assets/icons/satellite.svg'
import { ReactComponent as Search } from '../assets/icons/search.svg'
import { ReactComponent as Share } from '../assets/icons/share.svg'
import { ReactComponent as Split } from '../assets/icons/split.svg'
import { ReactComponent as Tick } from '../assets/icons/tick.svg'
import { ReactComponent as ViewOnMap } from '../assets/icons/view-on-map.svg'
import { ReactComponent as Warning } from '../assets/icons/warning.svg'
import styles from './Icon.module.css'

export const IconComponents = {
  'arrow-down': ArrowDown,
  'arrow-right': ArrowRight,
  'arrow-top': ArrowTop,
  camera: Camera,
  close: Close,
  compare: Compare,
  delete: Delete,
  download: Download,
  edit: Edit,
  email: Email,
  graph: Graph,
  home: Home,
  info: Info,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  publish: Publish,
  'remove-from-map': RemoveFromMap,
  ruler: Ruler,
  satellite: Satellite,
  search: Search,
  share: Share,
  split: Split,
  tick: Tick,
  'view-on-map': ViewOnMap,
  warning: Warning,
}

interface IconProps {
  className?: string
  icon: keyof typeof IconComponents
  type?: 'default' | 'warning'
  tooltip?: React.ReactChild | React.ReactChild[] | string
  tooltipPlacement?: Placement
}

const Icon: React.FC<IconProps> = (props) => {
  const { icon, tooltip, type = 'default', className = '' } = props
  const Component = useMemo(() => IconComponents[icon], [icon])
  return (
    <Tooltip content={tooltip} placement="auto">
      <Component className={cx(styles.icon, styles[type], className)} />
    </Tooltip>
  )
}

export default Icon
