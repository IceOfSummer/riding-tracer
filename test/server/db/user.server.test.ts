import { test, expect } from '@jest/globals'
import { pbkdf2_test } from '~/server/db/user.server'

test('Test Login', async () => {
  expect(pbkdf2_test!('Hello World')).toBe(pbkdf2_test!('Hello World'))
  console.log(pbkdf2_test!('Hello World'))
})