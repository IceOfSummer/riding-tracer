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



/**
 * 注册用户
 * @param username 用户名
 * @param password 密码
 * @return {number} 新创建用户的uid，返回空表示用户已经存在
 */
export const registerUser = async (username: string, password: string): Promise<{id: number} | null> => {
  const cnt = await db.user.count({
    where: {
      username
    }
  })
  if (cnt > 0) {
    return null
  }

  const usr = await db.user.create({
    data: {
      username,
      password: pbkdf2(password),
      createTime: new Date()
    }
  })
  return {
    id: usr.id,
  }
}

