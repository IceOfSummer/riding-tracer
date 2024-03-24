import { createCookieSessionStorage } from '@remix-run/node'

type SessionData = {
    userId: number;
}

type SessionFlashData = {
    error: string;
}


const sessionStorage =
    createCookieSessionStorage<SessionData & Record<string, unknown>, SessionFlashData>(
      {
        // a Cookie from `createCookie` or the CookieOptions to create one
        cookie: {
          name: '__session',

          // Expires can also be set (although maxAge overrides it when used in combination).
          // Note that this method is NOT recommended as `new Date` creates only one date on each server deployment, not a dynamic date in the future!
          //
          // expires: new Date(Date.now() + 60_000),
          httpOnly: true,
          maxAge: 60,
          path: '/',
          sameSite: 'lax',
          secrets: [process.env.SESSION_SECRET as string],
          secure: true,
        },
      }
    )

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type SessionValueKey<ResultType> = string

type SessionDataWrapper = SessionData & {
  /**
   * 获取session中的值
   * @param key key
   */
  get: <T> (key: SessionValueKey<T>) => T | undefined
  /**
   * 设置session的值
   * @param key key
   * @param value 新值
   */
  set: <T> (key: SessionValueKey<T>, value: T) => void
}


export const getSession = async (request: Request): Promise<SessionDataWrapper | null> => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const userId =session.get('userId')
  if (userId === undefined) {
    return null
  }
  return {
    userId,
    get <T> (key: SessionValueKey<T>) {
      return session.get(key) as T
    },
    set(key, value) {
      session.set(key, value)
    }
  }
}

export const createSession = async (request: Request, data: SessionData) => {
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  session.set('userId', data.userId)
  return session
}

export const commitSession = sessionStorage.commitSession
export const destroySession = sessionStorage.destroySession
