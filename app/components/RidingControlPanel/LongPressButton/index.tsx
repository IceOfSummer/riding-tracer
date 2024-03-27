import type { PropsWithChildren } from 'react'
import { useRef , useState } from 'react'
import type React from 'react'
import styles from '../styles.module.css'
import { toClassnames } from '~/util/DOMUtils'

interface LongPressButtonProps {
  onLongPress?: () => void
  color?: string
}

const LongPressButton:React.FC<PropsWithChildren<LongPressButtonProps>> = props => {
  const [isPress, setIsPress] = useState(false)
  const startTime = useRef(0)

  const onPressDown = (evt: React.UIEvent<unknown>) => {
    evt.preventDefault()
    startTime.current = Date.now()
    setIsPress(true)
    console.log('press')
  }
  
  const onPressUp = (evt: React.UIEvent<unknown>) => {
    evt.preventDefault()
    console.log('end', Date.now() - startTime.current)
    if (Date.now() - startTime.current >= 3000) {
      props.onLongPress?.()
    }
    setIsPress(false)
  }

  return (
    <button className={toClassnames(isPress ? styles.longPressButtonPressing : undefined, styles.longPressButton)}
      onTouchStart={onPressDown}
      onMouseDown={onPressDown}
      onTouchEnd={onPressUp}
      onMouseUp={onPressUp}>
      <div style={{ color: props.color }}>
        {props.children}
      </div>
    </button>
  )
}

export default LongPressButton