import React from 'react'
import '@amap/amap-jsapi-types'

interface AMapComponentProps {
  secretKey: string
  appKey: string
}
interface AMapComponentState {
  mapInstance: AMap.Map
}

class AMapComponent extends React.Component<AMapComponentProps, AMapComponentState> {

  private mapInstance: AMap.Map | null = null

  private currentPosition = {
    x: 116.397477,
    y: 39.908692
  }

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
      this.toCurrentPosition()
    }).catch((e: unknown) => {
      console.error(e)
    })
  }

  private toCurrentPosition(): void {
    const mapInstance = this.mapInstance
    if (!mapInstance) {
      return
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    mapInstance.plugin('AMap.Geolocation', () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：5s
        position: 'RB',    //定位按钮的停靠位置
        offset: [10, 20], //定位按钮与设置的停靠位置的偏移量，默认：[10, 20]
        zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
      })
      mapInstance.addControl(geolocation)
      geolocation.getCurrentPosition((status: string, result: GeolocationResult) => {
        console.log(status, result)
        alert(status)
        alert(JSON.stringify(result))
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