import db from '~/server/db.server'
import snowflake from '~/server/util/snowflake.server'
import { badRequest } from '~/server/util/ResponseUtils.server'
import type { Point } from '~/server/db/types'
import type { Prisma , TraceRecord, TracePointsSet } from '@prisma/client'
import * as process from 'process'
import { queryUserAchievement } from '~/server/db/achievement.server'


export enum TraceRecordStatus {
  ACTIVE,
  FINISHED
}

async function isTraceRecordNotExist(userId: number, recordId: string) {
  return await db.traceRecord.count({
    where: {
      userId,
      id: recordId
    }
  }) === 0
}

/**
 * 创建一个新的骑行记录
 * @return {string} 记录id
 */
export const createRidingRecord = async (userId: number): Promise<string> => {
  // 在客户端做数据恢复
  const recordId = snowflake.getUniqueID().toString(10)
  await db.traceRecord.create({
    data: {
      userId: userId,
      id: recordId,
      startTime: new Date(),
      status: TraceRecordStatus.ACTIVE,
    }
  })
  return recordId
}


export const saveTemporaryPoint = async (userId: number, recordId: string, points: Point[]) => {
  if (points.length === 0) {
    return
  }
  if (await isTraceRecordNotExist(userId, recordId)) {
    throw badRequest('未找到对应的骑行记录')
  }
  await db.temporaryPointsSet.create({
    data: {
      recordId: recordId,
      id: snowflake.getUniqueID().toString(10),
      points: JSON.stringify(points)
    }
  })
}

function toRad(degrees: number) {
  return degrees * (Math.PI / 180)
}


/**
 * 计算两个点的距离.
 * Haversine公式.
 * @return {number} 两点之间的距离, 单位: 米
 */
function countDistance(p1: Point, p2: Point): number {
  const lat1 = p1[1], lat2 = p2[1], lon1 = p1[0], lon2 = p2[0]
  const R = 6371 // 地球平均半径（千米）
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c * 1000
}

export const _testCountDistance = process.env.NODE_ENV === 'test' ? countDistance : undefined

async function summaryRidingPoints(recordId: string, startTime: number, remainingPoints?: Point[]) {
  const records = await db.temporaryPointsSet.findMany({
    where: {
      recordId
    }
  })
  if (records.length === 0 && (!remainingPoints || remainingPoints.length === 0)) {
    throw badRequest('骑行时间过短')
  }
  if (remainingPoints) {
    records.push({
      points: remainingPoints,
      recordId,
      id: '-1'
    })
  }
  let distance = 0
  const end = new Date()
  const points: Point[] = []

  let lastPoint: Point = [...records[0].points[0]]
  for (let i = 0; i < records.length; i++) {
    const currentPoints = records[i].points
    for (let j = 0; j < currentPoints.length; j++) {
      const current = currentPoints[j]
      distance += countDistance(lastPoint, current)
      lastPoint = current
      points.push(current)
    }
  }

  const result: Prisma.TracePointsSetCreateArgs = {
    data: {
      id: snowflake.getUniqueID().toString(10),
      pointsSet: JSON.stringify(points),
      endTime: end,
      distance,
      speed: distance / ((end.getTime() - startTime) / 1000)
    }
  }

  return result
}

/**
 * 完成骑行
 * @param userId 用户id
 * @param recordId 记录id
 * @param remainingPoints 剩余的点
 */
export const finishRiding = async (userId: number, recordId: string, remainingPoints: Point[]): Promise<void> => {
  const trace = await db.traceRecord.findUnique({
    where: {
      userId_id: {
        userId,
        id: recordId
      }
    }
  })
  if (!trace) {
    throw badRequest('未找到对应的骑行记录')
  }

  await db.$transaction(async tx => {
    const result = await summaryRidingPoints(recordId, trace.startTime.getTime(), remainingPoints)
    await tx.traceRecord.update({
      data: {
        status: TraceRecordStatus.FINISHED,
        tracePointsId: result.data.id
      },
      where: {
        userId_id: {
          userId,
          id: recordId
        }
      }
    })
    await tx.tracePointsSet.create(result)
    // record achievement.
    const oldAchievement = await queryUserAchievement(userId)
    if (!oldAchievement) {
      throw badRequest('用户不存在')
    }
    const timeCost = ((result.data.endTime as Date).getTime() - trace.startTime.getTime()) / 1000
    await tx.userAchievement.update({
      data: {
        fastest: Math.max(result.data.distance / timeCost, oldAchievement.fastest),
        time: oldAchievement.time + timeCost,
        longestDistance: Math.max(result.data.distance, oldAchievement.longestDistance),
        longestTime: Math.max(timeCost, oldAchievement.longestTime),
        count: oldAchievement.count + 1,
        distance: oldAchievement.distance + result.data.distance
      },
      where: {
        id: userId
      }
    })
    return Promise.resolve()
  })
}

export type RideRecordResult = TraceRecord & Omit<TracePointsSet, 'pointsSet' | 'id'>

/**
 * 查询骑行记录
 * @param userId 用户id
 * @param page 第几页，从0开始
 * @param size 每页大小
 */
export const queryRideRecord = async (userId: number, page: number = 0, size: number = 6): Promise<RideRecordResult[]> => {
  const records = await db.traceRecord.findMany({
    where: {
      userId,
      status: TraceRecordStatus.FINISHED
    },
    skip: page * size,
    take: size,
    orderBy: {
      id: 'desc'
    }
  })
  if (!records) {
    return []
  }
  const result: RideRecordResult[] = []
  for (const record of records) {
    const tracePointsId = record.tracePointsId
    if (!tracePointsId) {
      continue
    }
    const points = await db.tracePointsSet.findUnique({
      where: {
        id: tracePointsId
      },
      select: {
        id: true,
        distance: true,
        endTime: true,
        speed: true,
      }
    })
    if (!points) {
      continue
    }
    record.tracePointsId = tracePointsId
    result.push({
      ...points,
      ...record
    })
  }
  return result
}

export type RidingExactlyResult = TraceRecord & Omit<TracePointsSet, 'id'>

/**
 * 查询详细的骑行
 * @param userId 用户id
 * @param recordId 记录id
 */
export const queryExactlyRidingRecord = async (userId: number, recordId: string): Promise<RidingExactlyResult | null> => {
  const record = await db.traceRecord.findUnique({
    where: {
      userId_id: {
        userId,
        id: recordId
      }
    }
  })
  if (!record) {
    return null
  }
  const tracePointsId = record.tracePointsId
  if (!tracePointsId) {
    return null
  }
  const points = await db.tracePointsSet.findUnique({
    where: {
      id: tracePointsId
    }
  })
  if (!points) {
    return null
  }
  return {
    ...points,
    ...record
  }
}