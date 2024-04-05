import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'
import { defer , json } from '@remix-run/node'

import { FloatingPanel } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { getSession } from '~/server/session.server'
import StatisticCard from '~/routes/riding._index/StatisticCard'
import { queryUserAchievement } from '~/server/db/achievement.server'
import { assertNonNull, badRequest } from '~/server/util/ResponseUtils.server'
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

export type LoadMoreArgs = {
  type: 'load',
  page: number
  size?: number
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request, true)
  const data = await request.json() as LoadMoreArgs
  if (!data) {
    throw badRequest()
  }
  const records = await queryRideRecord(session.userId, data.page, data.size)
  return json({
    result: records,
  })
}

const DEFAULT_ANCHOR = [72, 72 + 119]

export default function RidingIndex() {
  const [anchors, setAnchors] = useState([72, 72 + 119])
  const [lock, setLock] = useState(true)

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

  const onHeightChange = (height: number) => {
    setLock(height !== anchors[anchors.length - 1])
  }
  
  return (
    <FloatingPanel anchors={anchors} style={{ width: '100%' }} onHeightChange={onHeightChange}>
      <RidingActionButton />
      <StatisticCard lock={lock}/>
    </FloatingPanel>
  )
}
