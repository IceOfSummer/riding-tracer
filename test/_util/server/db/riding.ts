import { _testCountDistance } from '~/server/db/riding.server'
import type { Point } from '~/server/db/types'


export const test_generateRidingPoints = async (pointCount = 10) => {
  const currentPos = [159.102147860244, 43.346784579237]
  let distance = 0

  pointCount--
  const batch: Point[] = [[currentPos[0], currentPos[1]]]
  for (let i = 0; i < pointCount; i++) {
    currentPos[0] += 0.01
    currentPos[1] += 0.01
    const curPoint: Point = [currentPos[0], currentPos[1]]
    distance += _testCountDistance!(curPoint, batch[batch.length - 1])
    batch.push(curPoint)
  }

  return {
    distance,
    points: batch
  }
}