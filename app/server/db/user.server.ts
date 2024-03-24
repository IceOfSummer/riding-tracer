import db from '~/server/db.server'
import * as crypto from 'crypto'


function pbkdf2(password: string): string {
  return crypto
    .pbkdf2Sync(password, process.env.PBKDF2_SALT ?? 'Riding-Tracer', 10000, 32, 'sha256')
    .toString('hex')
}

let _pbkdf2_test: typeof pbkdf2 | undefined
if (process.env.NODE_ENV === 'test') {
  _pbkdf2_test = (password: string) => {
    return pbkdf2(password)
  }
} else {
  _pbkdf2_test = undefined
}
export const pbkdf2_test = _pbkdf2_test

/**
 * 尝试登录
 * @param username 用户名
 * @param password 密码
 * @return {} 用户id，如果密码正确
 */
export const tryLogin = async (username?: string, password?: string): Promise<{id: number} | null> => {
  if (!username || !password) {
    return null
  }
  const result = await db.user.findUnique({
    where: {
      username
    },
    select: {
      id: true,
      password: true
    }
  })
  if (result == null || pbkdf2(password) != result.password) {
    return null
  }
  return {
    id: result.id
  }
}