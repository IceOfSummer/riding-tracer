// https://remix.run/docs/en/main/route/loader#returning-response-instances
import { isRouteErrorResponse, useRouteError } from '@remix-run/react'
import { Dialog } from 'antd-mobile'
import { useEffect } from 'react'

function Handle403() {
  useEffect(() => {
    Dialog.confirm({
      title: '错误',
      content: '请先登录',
      confirmText: '登录',
      onConfirm() {
        location.href = '/login'
      }
    }).catch(e => {
      console.error(e)
    })
  }, [])
  return null
}

const RootErrorBoundary = () => {
  const error = useRouteError() as Error
  if (isRouteErrorResponse(error)) {
    switch (error.status) {
    case 403:
      return Handle403()
    default:
      return (
        <div>
          {error.data.message}
        </div>
      )
      
    }
    
  }
  return (
    <div>
      Something went wrong:{' '}
      {error?.message || 'Unknown Error'}
    </div>
  )
}

export default RootErrorBoundary