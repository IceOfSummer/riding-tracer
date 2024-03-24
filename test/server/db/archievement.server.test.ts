import { test, expect } from '@jest/globals'
import db from '~/server/db.server'
import { queryUserAchievement } from '~/server/db/achievement.server'
import { test_expectNonNull } from '../../_util/TestUtils'

test('Achievement init', async () => {
  try {
    await db.userAchievement.delete({
      where: {
        id: 1
      }
    })
  } catch (ignored) { /** Error because of achievement not found **/ }
  const achievement = await queryUserAchievement(1)
  test_expectNonNull(achievement)
  expect(achievement.count).toBe(0)
})