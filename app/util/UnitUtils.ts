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
