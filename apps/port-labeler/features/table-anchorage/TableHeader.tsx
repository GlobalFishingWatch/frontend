import React from 'react'
import { Icon } from '@globalfishingwatch/ui-components'
import styles from './TableAnchorage.module.css'

type SidebarProps = {
    order: 'asc' | 'desc' | '',
    label: string,
    onToggle: (order: string) => void
}

function TableHeader({ order, label, onToggle }: SidebarProps) {

    return (
        <div className={styles.col}>
            <button className={styles.sortIcon} onClick={() => order === 'desc' ? onToggle('asc') : onToggle('desc')}>
                <label>{label}</label>
                <div className={styles.iconRight}>
                    {order === 'desc' && <Icon icon="arrow-down" />}
                    {order === 'asc' && <Icon icon="arrow-top" />}
                </div>
            </button>
        </div>
    )
}

export default TableHeader
