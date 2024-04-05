import type React from 'react'
import { useRef , useEffect, useState } from 'react'
import type { loader, LoadMoreArgs , action } from '../route'
import { useLoaderData } from '@remix-run/react'
import styles from './StatisticCard.module.css'
import { Card, List, Button, InfiniteScroll } from 'antd-mobile'
import { formatDate, formatDistance, formatTime, formatToNormalDate, timeDiff } from '~/util/UnitUtils'
import { useNavigate } from 'react-router'
import useAsyncFetcher from '~/server/util/useAsyncFetcher'


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

interface StatisticCardProps {
  lock: boolean
}

const PAGE_SIZE = 6

/**
 * 数据统计
 */
const StatisticCard: React.FC<StatisticCardProps> = props => {
  const { achievement, records } = useLoaderData<typeof loader>()
  const [rideRecords, setRideRecords] = useState<typeof records>([])
  const navigate = useNavigate()
  const recordFetcher = useAsyncFetcher<typeof action>()
  const [hasMore, setHasMore] = useState(true)

  const currentPage = useRef(1)

  useEffect(() => {
    setRideRecords(records)
  }, [])

  const loadMore = async () => {
    if (props.lock) {
      return
    }
    const arg: LoadMoreArgs = {
      page: currentPage.current,
      type: 'load',
      size: PAGE_SIZE
    }
    const result = await recordFetcher.submit(JSON.stringify(arg), {
      method: 'post',
      encType: 'application/json'
    })
    if (result.result.length < PAGE_SIZE) {
      setHasMore(false)
    }
    setRideRecords([...rideRecords, ...result.result])
  }

  return (
    <div>
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
      <Card title="骑行记录">
        <List>
          {
            rideRecords.map(item => (
              <List.Item key={item.id}
                extra={(
                  <Button fill="none" className={styles.infoButton} onClick={() => navigate(`/riding/view/${item.id}`)}>查看详情</Button>
                )}
                description={`${formatDate(item.endTime)} (${formatToNormalDate(item.endTime)})`}>
                骑行: {formatDistance(item.distance)} ({formatTime(timeDiff(item.startTime, item.endTime) / 1000)})
              </List.Item>
            ))
          }
          <InfiniteScroll hasMore={hasMore} loadMore={loadMore} />
        </List>
      </Card>
    </div>
  )
}

export default StatisticCard