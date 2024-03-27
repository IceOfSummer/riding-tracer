import React, { useRef, useState } from 'react'

export type RecorderState = {
  distance: number
  speed: number
  recordId?: string
}

const initialValue:RecorderState = {
  distance: 0,
  speed: 0
}



/**
 * 路径点记录
 * TODO 数据恢复.
 * @param minRecordDistance 插入新的点时，若距离上一个点不足该距离(单位：米)，则舍弃该点.
 */
const useTraceRecorder = (minRecordDistance = 4) => {
  const startTime = useRef<number>()
  const points = useRef<AMap.LngLat[]>([])
  const [state, setState] = useState<RecorderState>(initialValue)
  

  /**
   * 弹出所有点
   */
  const popAll = React.useCallback((keepLastOne = false) => {
    const old = points.current
    if (old.length === 0) {
      return old
    }
    if (keepLastOne) {
      points.current = [old[old.length - 1]]
      return old.slice(0, old.length - 1)
    } else {
      points.current = []
      return old
    }
  }, [])

  const addPoint = React.useCallback((point: AMap.LngLat) => {
    if (!startTime.current) {
      startTime.current = Date.now()
    }
    const lastPoint = points.current[points.current.length - 1]
    if (!lastPoint) {
      points.current.push(point)
      return
    }
    const dis = AMap.GeometryUtil.distance(point, lastPoint)
    if (dis >= minRecordDistance) {
      points.current.push(point)
      setState((prev) => {
        const startTimeValue = startTime.current
        const nextDistance = prev.distance + dis
        return {
          distance: nextDistance,
          speed: startTimeValue ? (nextDistance / (Date.now() - startTimeValue)) : 0
        }
      })
    }
  }, [minRecordDistance])

  const size = () => {
    return points.current.length
  }

  const setRecordId = (id: string) => {
    setState(prevState => {
      return {
        ...prevState,
        recordId: id
      }
    })
  }

  type HookReturnVal = [RecorderState, { setRecordId: typeof setRecordId, size: typeof size, addPoint: typeof addPoint, popAll: typeof popAll}]
  // 所有方法均可缓存后调用
  const r: HookReturnVal = [
    state,
    {
      setRecordId,
      size,
      addPoint,
      popAll
    }
  ]
  return r
}

export default useTraceRecorder