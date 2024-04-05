import type React from 'react'
import { useEffect , useContext } from 'react'
import type { LoaderFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { badRequest } from '~/server/util/ResponseUtils.server'
import { queryExactlyRidingRecord } from '~/server/db/riding.server'
import { getSession } from '~/server/session.server'
import { useLoaderData } from '@remix-run/react'
import { RidingRootContext } from '~/routes/riding/route'
import type { Point } from '~/server/db/types'
import BackButton from '~/components/BackButton'

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

const RidingView:React.FC = () => {
  const loaderData = useLoaderData<typeof loader>()
  const { mapInstance } = useContext(RidingRootContext)
  
  useEffect(() => {
    const result = JSON.parse(loaderData.result.pointsSet) as Point[]
    mapInstance.drawTrace(result)
  }, [])
  
  return (
    <BackButton></BackButton>
  )
}

export default RidingView