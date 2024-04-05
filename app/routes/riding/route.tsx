import type { MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import AMapComponent from '~/components/AMapComponent'
import * as process from 'process'
import { Outlet, useLoaderData, useLocation } from '@remix-run/react'
import React, { useEffect, useState } from 'react'

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

export interface RidingRootContextState {
  mapInstance: AMapComponent,
}


export const RidingRootContext =
  React.createContext<RidingRootContextState>(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    null
  )

const Riding:React.FC = () => {
  const loaderData = useLoaderData<typeof loader>()
  const [contextValue, setContextValue] = useState<RidingRootContextState>()
  const [mapInitDone, setMapInitDone] = useState(false)
  const location = useLocation()

  useEffect(() => {
    console.log(location)
    if (location.pathname === '/riding' && mapInitDone) {
      contextValue?.mapInstance.reset()
    }
  }, [location])

  const refCallback = React.useCallback((instance: AMapComponent) => {
    setContextValue({
      mapInstance: instance,
    })
  }, [])

  return (
    <div>
      <AMapComponent onInitDone={() => setMapInitDone(true)} appKey={loaderData.appKey} secretKey={loaderData.appSecret} ref={refCallback}/>
      {
        contextValue && mapInitDone ? (
          <RidingRootContext.Provider value={contextValue}>
            <Outlet/>
          </RidingRootContext.Provider>
        ) : null
      }
    </div>
  )
}

export default Riding
