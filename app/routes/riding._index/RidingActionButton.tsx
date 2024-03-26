import React, { useState } from 'react'
import { ActionSheet, Button } from 'antd-mobile'

const actions = [
  { text: '自由骑行', key: 'freedom' },
  { text: '定点骑行', key: 'point' }
]

interface StartRidingProps {
}

const RidingActionButton: React.FC<StartRidingProps> = () => {
  const [visible, setVisible] = useState(false)

  const onSelect = (_: unknown, index: number) => {
    setVisible(false)
    console.log(index)
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