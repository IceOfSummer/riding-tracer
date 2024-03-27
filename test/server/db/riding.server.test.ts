import { test, expect } from '@jest/globals'
import { _testCountDistance, createRidingRecord, finishRiding, saveTemporaryPoint } from '~/server/db/riding.server'
import type { Point } from '~/server/db/types'
import db from '~/server/db.server'
import { test_expectNonNull } from '../../_util/TestUtils'
import { test_generateRidingPoints } from '../../_util/server/db/riding'

// 最大误差，米
const TOLERATE = 50

test('Test Record Start', async () => {
  expect(typeof (await createRidingRecord(1))).toBe('string')
})

test('Test Distance Count', () => {
  const toBeTest: {p1: [number, number], p2: [number, number], aMapResult: number}[] = [
    { p1: [159.102147860244, 43.346784579237], p2: [159.102167860244, 43.445794579237], aMapResult: 11021.742902402575 },
    { p1: [159.102147860244, 43.346784579237], p2: [159.109167860244, 43.371788939237], aMapResult: 2840.8302843693996 },
    { p1: [159.102147860244, 43.346784579237], p2: [159.102167860244, 43.345794579237], aMapResult: 110.21821067518557 },
  ]
  toBeTest.sort((a, b) => b.aMapResult - a.aMapResult)

  let lastGap = Number.MAX_VALUE
  // 当移动距离越短，误差越小(10km时误差为 10m 左右).
  for (const holder of toBeTest) {
    const { p1, p2, aMapResult } = holder
    const gap = Math.abs(_testCountDistance!(p1, p2) - aMapResult)
    expect(gap).toBeLessThan(TOLERATE)
    expect(gap).toBeLessThan(lastGap)
    console.log('current gap is: ' + gap)
    lastGap = gap
  }
})

/**
 * 测试基本骑行流程: 开始 -> 上传 -> 结束
 */
test('Test Riding Workflow', async () => {
  const userId = 1
  const recordId = await createRidingRecord(userId)
  console.log('recordId is: ' + recordId)
  const { distance, points } = await test_generateRidingPoints()
  
  await saveTemporaryPoint(userId, recordId, points)

  await finishRiding(userId, recordId, [])

  const result = await db.traceRecord.findUnique({
    where: {
      userId_id: {
        userId,
        id: recordId
      }
    },
    select: {
      tracePointsId: true
    }
  })

  test_expectNonNull(result)
  test_expectNonNull(result.tracePointsId)

  const pointsSet = await db.tracePointsSet.findUnique({
    where: {
      id: result.tracePointsId
    }
  })

  test_expectNonNull(pointsSet)
  // 浮点数，不好比较
  expect(Math.abs(pointsSet.distance - distance)).toBeLessThan(1)
})