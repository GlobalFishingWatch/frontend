import React, { useCallback } from 'react'

import { Icon } from '@globalfishingwatch/ui-components'

import styles from './TableAnchorage.module.css'

type SidebarProps = {
    order?: 'asc' | 'desc' | '',
    label: any,
    onToggle?: (order: string) => void
}

function TableHeader({ order, label, onToggle }: SidebarProps) {

    const setSort = useCallback(e => {
        if (onToggle) {
            order === 'desc' ? onToggle('asc') : onToggle('desc')
        }
    }, [order, onToggle])

    return (
        <div className={styles.col}>
            <button className={styles.sortIcon} onClick={setSort}>
                <label>{label}</label>
                {order && <div className={styles.iconRight}>
                    {order === 'desc' && <Icon icon="arrow-down" />}
                    {order === 'asc' && <Icon icon="arrow-top" />}
                </div>}
            </button>
        </div>
    )
}

export default TableHeader
