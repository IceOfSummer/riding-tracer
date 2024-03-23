import { PrismaClient } from '@prisma/client'

import * as process from 'process'

let db: ReturnType<typeof initClient> 
declare global {
  // eslint-disable-next-line no-var
  var __db__: ReturnType<typeof initClient> | undefined
}

function initClient() {
  return new PrismaClient()
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