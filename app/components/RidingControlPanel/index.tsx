import React from 'react'
import type { RidingRootContextState } from '~/routes/riding/route'
import { RidingRootContext } from '~/routes/riding/route'
import { LeftOutline } from 'antd-mobile-icons'
import { Button,Toast } from 'antd-mobile'
import styles from './styles.module.css'
import { formatDistance, formatTime } from '~/util/UnitUtils'
import LongPressButton from '~/components/RidingControlPanel/LongPressButton'



interface RidingControlPanelState {
  isRiding: boolean
  distance: number
  speed: string
}

interface RidingControlPanelProps {
  /**
   * 当点击返回按钮时
   */
  onGoBack: () => void
  /**
   * 当需要初始化记录时
   */
  onRequireInit: () => void
  /**
   * 需要上传点时
   * @param points 点集
   */
  onRequiredUpload: (points: AMap.LngLat[]) => void
  /**
   * 当记录停止时
   * @param points 剩余的点
   */
  onRecordStop: (points: AMap.LngLat[]) => void
  loading?: boolean
}

interface TopDownItemProps {
  name: string
  value: string
}

const TopDownItem: React.FC<TopDownItemProps> = props => {
  return (
    <div className={styles.topDownItem}>
      <span>{props.name}</span>
      <span>{props.value}</span>
    </div>
  )
}

const INTERVAL = 2000
const MIN_RECORD_DISTANCE = 10

class RidingControlPanel extends React.Component<RidingControlPanelProps, RidingControlPanelState, RidingRootContextState> {


  static contextType = RidingRootContext

  declare context: React.ContextType<typeof RidingRootContext>

  declare props: RidingControlPanelProps

  private points: AMap.LngLat[] = []

  private timer?: NodeJS.Timeout

  private startTime?: number

  state: RidingControlPanelState = {
    isRiding: false,
    distance: 0,
    speed: '0',
  }


  constructor(props: RidingControlPanelProps) {
    super(props)
    this.stopRiding = this.stopRiding.bind(this)
  }

  private async saveCurrentPos() {
    let pos
    try {
      pos = await this.context.mapInstance.resolveCurrentPosition()
    } catch (e) {
      Toast.show({
        content: '获取定位失败.',
        position: 'bottom'
      })
      console.error(e)
      return
    }

    const lastPoint = this.points[this.points.length - 1]
    this.points.push(pos.position)
    if (lastPoint) {
      const dis = AMap.GeometryUtil.distance(pos.position, lastPoint)
      if (dis >= MIN_RECORD_DISTANCE) {
        this.setState(prev => {
          const startTimeValue = this.startTime
          const nextDistance = prev.distance + dis
          return {
            ...prev,
            distance: nextDistance,
            speed: startTimeValue ? (nextDistance / ((Date.now() - startTimeValue) / 1000)).toFixed(2) + 'm/s': '0',
          }
        })
      }
    }

    if (this.points.length > 10) {
      const old = this.points
      this.points = [old[old.length - 1]]
      this.props.onRequiredUpload(old.slice(0, old.length - 1))
      return
    }
  }

  private stopRiding() {
    this.setState({
      isRiding: false
    })
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.props.onRecordStop(this.points)
  }

  private callTimer() {
    if (this.state.isRiding) {
      this.timer = setTimeout(() => {
        this.saveCurrentPos().catch(e => { console.error(e) }).finally(() => {
          this.callTimer()
        })
      }, INTERVAL)
    }
  }

  /**
   * 开始骑行记录
   */
  public startRiding() {
    this.startTime = Date.now()
    this.setState({
      isRiding: true
    }, () => {
      this.callTimer()
    })
  }

  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }

  render() {
    const { state, props } = this
    return (
      <div>
        <div className={[styles.back, state.isRiding ? styles.backHide : styles.backVisible].join(' ')}
          role="button"
          tabIndex={0}
          onClick={props.onGoBack}
          onKeyUp={props.onGoBack}
        >
          <LeftOutline fontSize="1.5rem" color="#000000"/>
        </div>
        <div className={[styles.dashboard, state.isRiding ? styles.dashboardOpen : styles.dashboardClose].join(' ')}>
          <TopDownItem name="骑行距离" value={formatDistance(state.distance)}/>
          <TopDownItem name="骑行速度" value={state.speed}/>
          <TopDownItem name="骑行时间" value={this.startTime ? formatTime(this.startTime, Date.now()) : ''}/>
        </div>
        <div className={styles.startBtnContainer}>
          {
            state.isRiding ?
              (<LongPressButton onLongPress={this.stopRiding}>停止记录</LongPressButton>) :
              (<Button color="primary" onClick={props.onRequireInit} loading={props.loading}>开始记录</Button>)
          }
        </div>
      </div>
    )
  }
}

RidingControlPanel.contextType = RidingRootContext

export default RidingControlPanel
