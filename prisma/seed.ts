import crypto from 'crypto'
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()
function pbkdf2(password: string): string {
  return crypto
    .pbkdf2Sync(password, process.env.PBKDF2_SALT ?? 'Riding-Tracer', 10000, 32, 'sha256')
    .toString('hex')
}

db.user.create({
  data: {
    createTime: new Date(),
    username: 'admin',
    password: pbkdf2('abc123')
  }
}).catch(e => {
  console.error(e)
})