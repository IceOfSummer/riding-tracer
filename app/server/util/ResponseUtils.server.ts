import { json } from '@remix-run/node'

export const unauthorized = () => json({ message: '请先登录' }, { status: 403 })