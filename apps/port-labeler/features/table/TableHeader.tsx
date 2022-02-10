import React from 'react'
import { Button, Icon, Select, SelectOption } from '@globalfishingwatch/ui-components'
import styles from './Table.module.css'

type SidebarProps = {
    order: 'asc' | 'desc' | '',
    label: string,
    onToggle: (order: string) => void
}

function TableHeader({ order, label, onToggle }: SidebarProps) {

    return (
        <th>
            <button className={styles.sortIcon} onClick={() => order === 'desc' ? onToggle('asc') : onToggle('desc')}>
                <label>{label}</label>
                <div className={styles.iconRight}>
                    {order === 'desc' && <Icon icon="arrow-down" />}
                    {order === 'asc' && <Icon icon="arrow-top" />}
                </div>
            </button>
        </th>
    )
}

export default TableHeader
