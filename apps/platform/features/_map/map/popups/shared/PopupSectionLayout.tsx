import cx from 'classnames'

import type { IconType } from '@globalfishingwatch/ui-components'
import { Icon } from '@globalfishingwatch/ui-components'

import styles from '../Popup.module.css'

type PopupSectionLayoutProps = {
  children: React.ReactNode
  icon?: IconType
  iconColor?: string
  /** for the rare icon that needs more than a colour, eg. the track arrow rotated by course */
  iconStyle?: React.CSSProperties
  /** rendered as the section heading; omit it and the header collapses to the icon alone */
  title?: React.ReactNode
  className?: string
  contentClassName?: string
  dataTest?: string
  translate?: 'no' | 'yes'
}

function PopupSectionLayout({
  children,
  icon,
  iconColor,
  iconStyle,
  title,
  className,
  contentClassName,
  dataTest,
  translate,
}: PopupSectionLayoutProps) {
  return (
    <div
      className={cx(styles.popupSection, { [styles.noIcon]: !icon }, className)}
      translate={translate}
    >
      {(icon || title) && (
        <div className={styles.popupSectionHeader}>
          {icon && (
            <Icon
              icon={icon}
              className={styles.layerIcon}
              style={{ color: iconColor, ...iconStyle }}
            />
          )}
          {title && <h3 className={styles.popupSectionTitle}>{title}</h3>}
        </div>
      )}
      <div
        className={cx(styles.popupSectionContent, styles.popupSectionCard, contentClassName)}
        data-test={dataTest}
      >
        {children}
      </div>
    </div>
  )
}

export default PopupSectionLayout
