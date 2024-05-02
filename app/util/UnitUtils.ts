const TIME_NAME = ['s', 'm', 'h']
/**
 * 格式化时间
 * @param seconds 第几秒
 * @return {string} 格式化后的时间. 例如<code>1h2m3s</code>
 */
function formatTime0(seconds: number): string
function formatTime0(start: Date | number, end: Date | number): string
function formatTime0(arg0: Date | number, arg1?: Date | number): string {
  let seconds: number
  if (arg1) {
    const start = typeof arg0 === 'number' ? arg0 : arg0.getTime()
    const end = typeof arg1 === 'number' ? arg1 : arg1.getTime()
    seconds = (end - start) / 1000
  } else {
    if (typeof arg0 === 'number') {
      seconds = arg0
    } else {
      throw new Error('Argument 0 should be a number')
    }
  }
  const sp = [seconds, 0, 0]
  for (let i = 0, len = sp.length - 1; i < len; i++) {
    while (sp[i] >= 60) {
      sp[i + 1]++
      sp[i] -= 60
    }
  }
  sp[0] = Math.round(sp[0])
  const result: string[] = []
  for (let i = sp.length - 1; i >= 1; i--) {
    if (sp[i] > 0) {
      result.push(sp[i] + TIME_NAME[i])
    }
  }
  // always show seconds.
  result.push(sp[0] + TIME_NAME[0])
  return result.join('')
}

export const formatTime = formatTime0

/**
 * 计算两个时间之间差多少毫秒
 * @param start 开始时间
 * @param end 结束时间
 */
export const timeDiff = (start: TimeLike, end: TimeLike): number => {
  return toTimeStamp(end) - toTimeStamp(start)
}

/**
 * 格式化距离
 * @param meters 米
 * @return {string} 格式化后的距离. 例如 <code>123m</code>、<code>1.32km</code>
 */
export const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return Math.round(meters) + 'm'
  }
  return (meters / 1000).toFixed(2) + 'km'
}

function toTimeStamp(timeLike: string | Date | number) {
  let timestamp: number
  if (typeof timeLike === 'number') {
    timestamp = timeLike
  } else if (typeof timeLike === 'string') {
    timestamp = new Date(timeLike).getTime()
  } else {
    timestamp = timeLike.getTime()
  }
  return timestamp
}

type TimeLike = string | Date | number

/**
 * 格式化时间
 * @param timeLike 过去的某个时间
 * @param currentTime 当前时间
 */
export const formatDate = (timeLike: TimeLike, currentTime?: TimeLike): string => {
  const timestamp = toTimeStamp(timeLike)
  const current = currentTime ? toTimeStamp(currentTime) : Date.now()
  
  const diff = (current - timestamp) / 1000
  if (diff < 60) {
    return Math.round(diff) + '秒前'
  } else if (diff < 3600) {
    return Math.round(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.round(diff / (60 * 60)) + '小时前'
  } else if (diff < 3600 * 24 * 30) {
    const hour = Math.round((diff % ((60 * 60 * 24))) / 3600)
    return `${Math.round(diff / (60 * 60 * 24))}天${hour > 0 ? hour + '小时' : ''}前`
  } else {
    return `${Math.round(diff / (60 * 60 * 24))}天前`
  }
}


export const formatToNormalDate = (timeLike: TimeLike): string => {
  const timestamp = toTimeStamp(timeLike)
  const date = new Date(timestamp)
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}