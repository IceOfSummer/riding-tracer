import type React from 'react'
import RidingSvg from '~/components/Icons/RidingSvg'
import { Outlet } from '@remix-run/react'
import styles from './auth.module.css'

const LoginPage:React.FC = () => {
  return (
    <div className={styles.loginContainer}>
      <div className={styles.styles}>
        <RidingSvg width="3rem" height="3rem"/>
        <span>骑行轨迹记录系统</span>
      </div>
      <div>
        <Outlet/>
      </div>
    </div>
  )
}

export default LoginPage