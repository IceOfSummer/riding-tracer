import React, { useState } from 'react'
import { ActionSheet, Button } from 'antd-mobile'
import { useNavigate } from 'react-router'

const actions = [
  { text: '自由骑行', key: 'freedom', path: '/riding/freedom' },
  { text: '定点骑行', key: 'point', path: '/riding/todo' }
]

interface StartRidingProps {
}

const RidingActionButton: React.FC<StartRidingProps> = () => {
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate()

  const onSelect = (_: unknown, index: number) => {
    setVisible(false)
    navigate(actions[index].path)
  }

  return (
    <>
      <div style={{ padding: '0 8px' }}>
        <Button color='primary' block onClick={() => setVisible(true)}>开始骑行</Button>
      </div>
      <ActionSheet onAction={onSelect}
        actions={actions}
        visible={visible}
        onClose={() => setVisible(false)}/>
    </>
  )
}
export default RidingActionButton