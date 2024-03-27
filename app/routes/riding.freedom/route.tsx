import type React from 'react'
import { useEffect , useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { useFetcher } from '@remix-run/react'
import type {
  FinishActionArgs,
  FinishActionType,
  StartActionArgs,
  StartActionTypes,
  UploadActionArgs,
  UploadActionTypes
} from '~/routes/riding.freedom/actionImpl'
import actionImpl from '~/routes/riding.freedom/actionImpl'
import RidingControlPanel from '~/components/RidingControlPanel'
import { Dialog } from 'antd-mobile'

// action function.
export const action = actionImpl


const FreedomRiding: React.FC = () => {
  const ridingControlPanel = useRef<RidingControlPanel>(null)
  const [recordId, setRecordId] = useState('')
  const navigate = useNavigate()

  const uploadFetcher = useFetcher<UploadActionTypes>({ key: 'uploadFetcher' })
  const ridingStartFetcher = useFetcher<StartActionTypes>({ key: 'lifecycleFetcher' })
  const finishFetcher = useFetcher<FinishActionType>({ key: 'finishFetcher' })
  
  const goHome = () => {
    navigate('/riding')
  }

  useEffect(() => {
    if (!ridingStartFetcher.data) {
      return
    }
    setRecordId(ridingStartFetcher.data.id)
    ridingControlPanel.current!.startRiding()
  }, [ridingStartFetcher.data])
  

  function doUpload(points: AMap.LngLat[]) {
    const args: UploadActionArgs = {
      action: 'upload',
      recordId: recordId,
      points: []
    }
    points.forEach(val => {
      args.points.push([val.lng, val.lat])
    })

    uploadFetcher.submit(JSON.stringify(args), {
      method: 'post',
      encType: 'application/json'
    })
  }
  
  const doInit = () => {
    const args: StartActionArgs = {
      action: 'start'
    }
    ridingStartFetcher.submit(JSON.stringify(args), {
      method: 'post',
      encType: 'application/json'
    })
  }
  
  const onFinish = (points: AMap.LngLat[]) => {
    const args: FinishActionArgs = {
      points: [],
      recordId,
      action: 'finish'
    }
    points.forEach(val => {
      args.points.push([val.lng, val.lat])
    })
    finishFetcher.submit(JSON.stringify(args), {
      method: 'post',
      encType: 'application/json'
    })
  }


  useEffect(() => {
    if (!finishFetcher.data) {
      return
    }
    if (finishFetcher.data.success) {
      Dialog.confirm({
        title: '上传成功',
        content: '是否回到主页',
        onConfirm: () => {
          navigate('/riding')
        }
      }).catch(e => { console.error(e) })
    }
  }, [finishFetcher.data, navigate])
  
  const loading = uploadFetcher.state !== 'idle' || ridingStartFetcher.state !== 'idle'

  return (
    <RidingControlPanel onGoBack={goHome}
      ref={ridingControlPanel}
      onRequiredUpload={doUpload}
      loading={loading}
      onRecordStop={onFinish}
      onRequireInit={doInit}
    />
  )
}

export default FreedomRiding