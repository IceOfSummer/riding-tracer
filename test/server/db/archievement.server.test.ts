import { test, expect } from '@jest/globals'
import db from '~/server/db.server'
import { queryUserAchievement } from '~/server/db/achievement.server'
import { test_expectNonNull, test_floatEqual } from '../../_util/TestUtils'
import { test_generateRidingPoints } from '../../_util/server/db/riding'
import { createRidingRecord, finishRiding } from '~/server/db/riding.server'

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


test('Test Achievement Record', async () => {
  const userId = 1
  const achievement = await queryUserAchievement(userId)
  test_expectNonNull(achievement)

  const recordId = await createRidingRecord(userId)
  console.log('recordId is: ' + recordId)
  const { distance, points } = await test_generateRidingPoints(30)

  await finishRiding(userId, recordId, points)

  const newAchievement = await queryUserAchievement(userId)

  test_expectNonNull(newAchievement)
  expect(newAchievement.count).toBe(achievement.count + 1)
  test_floatEqual(newAchievement.distance, achievement.distance + distance, 1)
  expect(newAchievement.fastest).toBeGreaterThanOrEqual(achievement.fastest)
  expect(newAchievement.time).toBeGreaterThanOrEqual(achievement.time)
})