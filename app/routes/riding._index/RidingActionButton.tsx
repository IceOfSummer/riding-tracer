import type React from 'react'
import { Button } from 'antd-mobile'
import { useNavigate } from 'react-router'

// 定点骑行被砍掉了QAQ
// const actions = [
//   { text: '自由骑行', key: 'freedom', path: '/riding/freedom' },
//   { text: '定点骑行', key: 'point', path: '/riding/located' }
// ]

interface StartRidingProps {
}

const RidingActionButton: React.FC<StartRidingProps> = () => {
  const navigate = useNavigate()


  return (
    <>
      <div style={{ padding: '0 8px' }}>
        <Button color='primary' block onClick={() => navigate('/riding/freedom')}>开始骑行</Button>
      </div>

    </>
  )
}
export default RidingActionButton