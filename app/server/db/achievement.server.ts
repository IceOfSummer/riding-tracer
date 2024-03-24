import db from '~/server/db.server'

/**
 * 获取用户成就.
 * @param userId 用户id
 */
export const queryUserAchievement = async (userId: number) => {
  let achievement = await db.userAchievement.findUnique({
    where: {
      id: userId
    }
  })
  if (!achievement) {
    // not found, check user is existing.
    const cnt = await db.user.count({
      where: {
        id: userId
      }
    })
    if (cnt === 1) {
      achievement = await db.userAchievement.create({
        data: {
          id: userId
        }
      })
    }
  }
  return achievement
}