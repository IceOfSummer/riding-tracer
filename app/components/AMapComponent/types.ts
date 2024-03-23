

type GeolocationResult = {
    /**
     * expected 0
     */
    status: number
    /**
     * expected 0
     */
    code: number
    /**
     * expected SUCCESS
     */
    info: string
    /**
     * 经度 纬度
     */
    position: [number, number]
    /**
     * 定位类别
     */
    location_type: string
    /**
     * 消息
     */
    message: string
    /**
     * 准确性，例如 43
     */
    accuracy: number
    isConverted: boolean
    /**
     * 高度
     */
    altitude: number | null
    /**
     * 高度准确性
     */
    altitudeAccuracy: number | null
    heading: number | null
    speed: number | null
}