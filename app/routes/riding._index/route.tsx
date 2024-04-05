import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { FloatingPanel } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { getSession } from '~/server/session.server'
import StatisticCard from '~/routes/riding._index/StatisticCard'
import { queryUserAchievement } from '~/server/db/achievement.server'
import { assertNonNull } from '~/server/util/ResponseUtils.server'
import RidingActionButton from '~/routes/riding._index/RidingActionButton'
import { queryRideRecord } from '~/server/db/riding.server'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request, true)
  const achievement = await queryUserAchievement(session.userId)
  const records = await queryRideRecord(session.userId)
  assertNonNull(achievement)

  return json({
    achievement,
    records
  })
}

const DEFAULT_ANCHOR = [72, 72 + 119]

export default function RidingIndex() {
  const [anchors, setAnchors] = useState([72, 72 + 119])

  const resizeCallback = React.useCallback(() => {
    setAnchors([...DEFAULT_ANCHOR, window.innerHeight * 0.8])
  }, [])

  useEffect(() => {
    resizeCallback()
    window.addEventListener('resize', resizeCallback)
    return () => {
      window.removeEventListener('resize', resizeCallback)
    }
  }, [resizeCallback])

  
  return (
    <FloatingPanel anchors={anchors} style={{ width: '100%' }}>
      <RidingActionButton />
      <StatisticCard/>
    </FloatingPanel>
  )
}
