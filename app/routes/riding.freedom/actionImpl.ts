import type { ActionFunctionArgs } from '@remix-run/node'
import { json } from '@remix-run/node'
import { badRequest } from '~/server/util/ResponseUtils.server'
import {createRidingRecord, finishRiding, saveTemporaryPoint} from '~/server/db/riding.server'
import { getSession } from '~/server/session.server'
import {a} from "@react-spring/web";

export type StartActionArgs = {
  action: 'start'
}

export type UploadActionArgs = {
  action: 'upload'
  recordId: string
  // 经度，纬度
  points: [number, number][]
}

export type FinishActionArgs = {
  action: 'finish'
  recordId: string
  points: [number, number][]
}

type ActionArgs = StartActionArgs | UploadActionArgs | FinishActionArgs



async function dealWithStartAction(request: ActionFunctionArgs['request']) {
  const session = await getSession(request, true)
  return json({
    success: true,
    id: await createRidingRecord(session.userId)
  })
}

async function dealWithUploadAction(request: ActionFunctionArgs['request'], arg: UploadActionArgs) {
  const session = await getSession(request, true)
  await saveTemporaryPoint(session.userId, arg.recordId, arg.points)
  return json({
    success: true
  })
}

async function dealWithFinishAction(request: ActionFunctionArgs['request'], arg: FinishActionArgs) {
  const session = await getSession(request, true)
  await finishRiding(session.userId, arg.recordId, arg.points)
  return json({
    success: true
  })
}

export type StartActionTypes = typeof dealWithStartAction
export type UploadActionTypes = typeof dealWithUploadAction
export type FinishActionType = typeof dealWithFinishAction


const actionImpl = async ({ request }: ActionFunctionArgs) => {
  const args = await request.json() as ActionArgs

  if (!args || !args.action) {
    throw badRequest()
  }
  switch (args.action) {
  case 'start':
    return await dealWithStartAction(request)
  case 'upload':
    return await dealWithUploadAction(request, args)
  case 'finish':
    return await dealWithFinishAction(request, args)
  default:
    throw badRequest('unknown action')
  }
}

export default actionImpl
