import React from 'react'
import styles from './AddButton.module.css'

const AddButton = ({ onClick }: { onClick?: () => void }) => {
  return <button className={styles.addButton} onClick={onClick} />
}

export default AddButton
