import { getSession } from 'next-auth/client';

/**
 * Handle incoming requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 */
export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });
  const { body } = req;

  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/admin/adminstatus`;
  await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
    body,
  })
    .then((response) => { res.status(response.status).end(); });
}
