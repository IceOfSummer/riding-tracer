import type React from 'react'
import type { loader } from '../route'
import { useLoaderData } from '@remix-run/react'
import styles from './StatisticCard.module.css'
import { Card } from 'antd-mobile'


function smartSecond(second: number): string {
  if (second < 60) {
    return second + '秒'
  } else if (second < 3600) {
    return (second / 60).toFixed(1) + '分钟'
  }
  return (second / 3600).toFixed(1) + '小时'

}

interface TopDownItemProps {
  name: string
  value: React.ReactNode
}

const TopDownItem: React.FC<TopDownItemProps> = (props) => {
  return (
    <div className={styles.achievementItem}>
      <span>{props.value}</span>
      <span>{props.name}</span>
    </div>
  )
}


/**
 * 数据统计
 */
const StatisticCard: React.FC = () => {
  const { achievement } = useLoaderData<typeof loader>()

  return (
    <Card title="骑行统计">
      <div className={styles.achievementContainer}>
        <TopDownItem name="骑行次数" value={achievement.count + '次'}/>
        <TopDownItem name="总骑行时间" value={smartSecond(achievement.time)}/>
        <TopDownItem name="最快速度" value={achievement.fastest + 'm/s'}/>
        <TopDownItem name="总骑行距离" value={achievement.distance + '米'}/>
        <TopDownItem name="最长骑行时间" value={smartSecond(achievement.longestTime)}/>
        <TopDownItem name="最长骑行距离" value={achievement.longestDistance + '米'}/>
      </div>
    </Card>
  )
}

export default StatisticCard