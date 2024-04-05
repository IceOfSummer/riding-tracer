import type React from 'react'
import {  useEffect , useContext } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { badRequest } from '~/server/util/ResponseUtils.server'
import { queryExactlyRidingRecord } from '~/server/db/riding.server'
import { getSession } from '~/server/session.server'
import { useLoaderData } from '@remix-run/react'
import { RidingRootContext } from '~/routes/riding/route'
import type { Point } from '~/server/db/types'
import BackButton from '~/components/BackButton'
import { FloatingPanel } from 'antd-mobile'
import TopDownItem from '~/components/TopDownItem'
import { formatDistance, formatTime, formatToNormalDate, timeDiff } from '~/util/UnitUtils'

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const session = await getSession(request, true)
  const recordId = params.id
  if (!recordId) {
    throw badRequest()
  }
  const result = await queryExactlyRidingRecord(session.userId, recordId)
  if (!result) {
    throw badRequest('记录不存在.')
  }
  return json({
    result
  })
}

const ANCHORS = [72, 72 + 119]

const RidingView:React.FC = () => {
  const { result } = useLoaderData<typeof loader>()
  const { mapInstance } = useContext(RidingRootContext)
  
  useEffect(() => {
    const points = JSON.parse(result.pointsSet) as Point[]
    mapInstance.drawTrace(points)
  }, [])

  return (
    <>
      <BackButton/>
      <FloatingPanel anchors={ANCHORS} style={{ width: '100%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          <TopDownItem name="开始时间" value={formatToNormalDate(result.startTime)} />
          <TopDownItem name="骑行时间" value={formatTime(timeDiff(result.startTime, result.endTime) / 1000)}/>
          <TopDownItem name="结束时间" value={formatToNormalDate(result.endTime)} />
          <TopDownItem name="骑行距离" value={formatDistance(result.distance)}/>
          <TopDownItem name="速度" value={result.speed.toFixed(2) + 'm/s'}/>
        </div>
      </FloatingPanel>
    </>
  )
}

export default RidingView