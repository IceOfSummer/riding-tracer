import type { LoaderFunctionArgs } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { getSession } from '~/server/session.server'


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await getSession(request)
  if (session) {
    return redirect('/riding')
  }
  return redirect('/auth')
}


export default function Index() {
  return (
    <span>(⌯꒪꒫꒪)੭</span>
  )
}
