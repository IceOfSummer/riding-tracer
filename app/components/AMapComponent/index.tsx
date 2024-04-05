import React from 'react'
import '@amap/amap-jsapi-types'
import { Dialog } from 'antd-mobile'
import type { Geolocation, GeolocationResult } from '~/components/AMapComponent/types'
import type { Point } from '~/server/db/types'

interface AMapComponentProps {
  secretKey: string
  appKey: string
  onInitDone: () => void
}
interface AMapComponentState {
  mapInstance: AMap.Map
}

interface Destroyable {
  destroy: () => void
}

class AMapComponent extends React.Component<AMapComponentProps, AMapComponentState> {

  private mapInstance: AMap.Map | null = null
  
  private geolocation: Geolocation | null = null
  
  private destroys: Destroyable[] = []

  constructor(props: Readonly<AMapComponentProps> | AMapComponentProps) {
    super(props)
  }

  componentDidMount() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    window._AMapSecurityConfig = {
      securityJsCode: this.props.secretKey,
    }
    this.initMap().then(() => {
      this.props.onInitDone()
    }).catch(e => {
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

  public drawTrace(points: Point[]) {
    AMap.plugin('AMap.MoveAnimation', () => {
      const map = this.mapInstance
      if (!map) {
        return
      }
      const marker = new AMap.Marker({
        map,
        position: points[0],
        icon: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
        offset: new AMap.Pixel(-13, -26),
      })
      
      new AMap.Polyline({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        map,
        path: points,
        showDir: true,
        strokeColor: '#28f',
        strokeWeight: 6
      })
  
      const passedPolyline = new AMap.Polyline({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        map,
        strokeColor: '#AF5',  //线颜色
        strokeWeight: 6,      //线宽
      })
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      marker.on('moving', function (e) {
        passedPolyline.setPath(e.passedPath)
        map.setCenter(e.target.getPosition(),true)
      })
      map.setFitView()
  
      marker.moveAlong(points, {
        // 每一段的时长
        duration: 500,//可根据实际采集时间间隔设置
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true,
      })
      this.destroys.push({
        destroy() {
          marker.pauseMove()
        }
      })
    })
  }
  
  public reset() {
    const todo = this.destroys
    this.destroys = []
    for (const destroyable of todo) {
      destroyable.destroy()
    }
    this.mapInstance?.clearMap()
    this.resolveCurrentPosition().catch(e => { console.error(e) })
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