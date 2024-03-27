import { PrismaClient } from '@prisma/client'

import * as process from 'process'
import type { Point } from '~/server/db/types'

let db: ReturnType<typeof initClient> 
declare global {
  // eslint-disable-next-line no-var
  var __db__: ReturnType<typeof initClient> | undefined
}

function initClient() {
  return new PrismaClient().$extends({
    result: {
      temporaryPointsSet: {
        points: {
          compute({ points }): Point[] {
            if (!points) {
              return []
            }
            return JSON.parse(points)
          }
        }
      }
    }
  })
}


if (process.env.NODE_ENV === 'production') {
  db = initClient()
} else {
  if (!global.__db__) {
    global.__db__ = initClient()
  }
  db = global.__db__
  db.$connect()
}
export default db