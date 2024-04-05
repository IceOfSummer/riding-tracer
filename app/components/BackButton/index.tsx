import styles from './styles.module.css'
import { LeftOutline } from 'antd-mobile-icons'
import type React from 'react'
import { useNavigate } from 'react-router'

const BackButton:React.FC = () => {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/riding')
  }
  
  return (
    <div className={styles.back}
      role="button"
      tabIndex={0}
      onClick={goHome}
      onKeyUp={goHome}
    >
      <LeftOutline fontSize="1.5rem" color="#000000"/>
    </div>
  )
}

export default BackButton