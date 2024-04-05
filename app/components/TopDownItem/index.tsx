import styles from './styles.module.css'
import type React from 'react'

interface TopDownItemProps {
  name?: React.ReactNode
  value?: React.ReactNode
}

const TopDownItem:React.FC<TopDownItemProps> = props => {
  return (
    <div className={styles.topDownItem}>
      <span>{props.value}</span>
      <span>{props.name}</span>
    </div>
  )
}

export default TopDownItem