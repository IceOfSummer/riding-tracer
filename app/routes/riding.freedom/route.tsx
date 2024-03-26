import React from 'react'
import { Button } from 'antd-mobile'
import styles from './freedom.module.css'

const FreedomRiding: React.FC = () => {
  return (
    <div>
      <div className={styles.startBtnContainer}>
        <Button color="primary">开始记录</Button>
      </div>
    </div>
  )
}

export default FreedomRiding