import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import AMapComponent from '~/components/AMapComponent'
import * as process from 'process'
import { useLoaderData } from '@remix-run/react'


export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' }
  ]
}

export const loader = ({ request }: LoaderFunctionArgs) => {
  return json({
    appKey: process.env.APP_KEY as string,
    appSecret: process.env.APP_SECRET as string
  })
}

export default function Index() {
  const loaderData = useLoaderData<typeof loader>()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <AMapComponent appKey={loaderData.appKey} secretKey={loaderData.appSecret}/>
    </div>
  )
}
