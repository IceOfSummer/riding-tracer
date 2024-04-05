import type { SerializeFrom } from '@remix-run/server-runtime'
import { useFetcher } from '@remix-run/react'
import { useEffect, useRef } from 'react'

type Result<TData> = SerializeFrom<TData>

type CallbackPromise<TData> = {
  resolve: (data: Result<TData>) => void
}



export default function useAsyncFetcher<T>(key?: string) {
  const fetcher = useFetcher<T>({ key })
  const promise = useRef<CallbackPromise<T>>()

  useEffect(() => {
    console.log(fetcher.data)
    if (fetcher.data) {
      promise.current?.resolve(fetcher.data)
    }
  }, [fetcher.data])
  
  return {
    submit(...args: Parameters<typeof fetcher.submit>): Promise<Result<T>> {
      return new Promise<Result<T>>((resolve, reject) => {
        promise.current = {
          resolve,
        }
        try {
          console.log(args)
          fetcher.submit(...args)
        } catch (e) {
          reject(e)
        }
      })
    }
  }
}