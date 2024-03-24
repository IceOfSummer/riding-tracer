import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import AMapComponent from '~/components/AMapComponent'
import * as process from 'process'
import { useLoaderData } from '@remix-run/react'
import { FloatingPanel } from 'antd-mobile'
import React, { useEffect, useState } from 'react'
import { getSession } from '~/server/session.server'
import StatisticCard from '~/routes/_index/StatisticCard'
import { queryUserAchievement } from '~/server/db/achievement.server'
import { assertNonNull } from '~/server/util/ResponseUtils.server'


export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request, true)
  const achievement = await queryUserAchievement(session.userId)
  assertNonNull(achievement)

  return json({
    appKey: process.env.APP_KEY as string,
    appSecret: process.env.APP_SECRET as string,
    achievement
  })
}

const DEFAULT_ANCHOR = [72, 72 + 119]

export default function Index() {
  const [anchors, setAnchors] = useState([72, 72 + 119])
  const loaderData = useLoaderData<typeof loader>()
  
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
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <AMapComponent appKey={loaderData.appKey} secretKey={loaderData.appSecret}/>
      <FloatingPanel anchors={anchors} style={{ width: '100%' }}>
        <StatisticCard/>
      </FloatingPanel>
    </div>
  )
}
