import React from 'react'
import '@amap/amap-jsapi-types'
import { Dialog } from 'antd-mobile'
import { Geolocation, GeolocationResult } from '~/components/AMapComponent/types'

interface AMapComponentProps {
  secretKey: string
  appKey: string
}
interface AMapComponentState {
  mapInstance: AMap.Map
}

class AMapComponent extends React.Component<AMapComponentProps, AMapComponentState> {

  private mapInstance: AMap.Map | null = null


  constructor(props: Readonly<AMapComponentProps> | AMapComponentProps) {
    super(props)
  }

  componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window._AMapSecurityConfig = {
      securityJsCode: this.props.secretKey,
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    AMapLoader.load({
      key: this.props.appKey,
      version: '2.0'
    }).then(() => {
      this.mapInstance = new AMap.Map('map-holder')
      this.resolveCurrentPosition().catch(e => {
        console.log(e)
      })
    }).catch((e: unknown) => {
      console.error(e)
    })
  }

  private resolveCurrentPosition(): Promise<GeolocationResult | null> {
    const mapInstance = this.mapInstance
    if (!mapInstance) {
      return Promise.resolve(null)
    }
    return new Promise<GeolocationResult | null>((resolve) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      mapInstance.plugin('AMap.Geolocation', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          position: 'RB',
          offset: [10, 20],
          zoomToAccuracy: true,
        }) as unknown as Geolocation

        mapInstance.addControl(geolocation)
        geolocation.getCurrentPosition((status, result) => {
          if (result.status !== 0) {
            console.log(status, result)
            Dialog.alert({
              title: '获取定位失败',
              content: result.message
            }).catch(e => {
              console.error(e)
            })
            resolve(null)
          } else {
            resolve(result)
          }
        })
      })
    })
  }

  componentWillUnmount() {
    this.mapInstance?.destroy()
  }

  render() {
    return (
      <div id="map-holder" style={{ width: '100vw', height: '100vh' }}/>
    )
  }

}

export default AMapComponent