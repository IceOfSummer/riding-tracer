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
  
  private geolocation: Geolocation | null = null


  constructor(props: Readonly<AMapComponentProps> | AMapComponentProps) {
    super(props)
  }

  componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window._AMapSecurityConfig = {
      securityJsCode: this.props.secretKey,
    }
    this.initMap().catch(e => {
      Dialog.alert({
        title: '加载地图失败',
        content: e.message
      }).catch(err => {
        console.error(err)
      })
    })
  }

  private async initMap() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    await AMapLoader.load({
      key: this.props.appKey,
      version: '2.0'
    })
    this.mapInstance = new AMap.Map('map-holder')
    await this.initGeolocation()
    await this.resolveCurrentPosition()
  }
  
  private initGeolocation() {
    return new Promise<void>((resolve) => {
      const mapInstance = this.mapInstance
      if (!mapInstance) {
        return Promise.reject('初始化地图失败')
      }
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
        this.geolocation = geolocation
        resolve()
      })
    })
  }

  public resolveCurrentPosition(): Promise<GeolocationResult> {
    const mapInstance = this.mapInstance
    if (!mapInstance) {
      return Promise.reject('初始化地图失败')
    }
    return new Promise((resolve, reject) => {
      this.geolocation?.getCurrentPosition((status, result) => {
        if (result.status !== 0) {
          reject(result)
        } else {
          resolve(result)
        }
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