import { json } from '@remix-run/node'

export const unauthorized = () => json({ message: '请先登录' }, { status: 403 })
export const internalServerError = () => json({ message: '系统错误, 请联系管理员' }, { status: 500 })
/**
 * 断言值一定非空，若断言失败，返回500
 * @see internalServerError
 */
export function assertNonNull (val: unknown): asserts val {
  if (!val) {
    throw internalServerError()
  }
}

