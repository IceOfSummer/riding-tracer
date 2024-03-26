import { json, MetaFunction } from '@remix-run/node'
import AMapComponent from '~/components/AMapComponent'
import * as process from 'process'
import { Outlet, useLoaderData } from '@remix-run/react'
import React from 'react'

export const meta: MetaFunction = () => {
  return [
    { title: '骑行记录' },
    { name: 'description', content: 'Riding Tracer!' }
  ]
}

export const loader = async () => {
  return json({
    appKey: process.env.APP_KEY as string,
    appSecret: process.env.APP_SECRET as string,
  })
}

const Riding:React.FC = () => {
  const loaderData = useLoaderData<typeof loader>()

  return (
    <div>
      <AMapComponent appKey={loaderData.appKey} secretKey={loaderData.appSecret}/>
      <Outlet/>
    </div>
  )
}

export default Riding
