import { getSession } from 'next-auth/client';

/**
 * Post the topic upload to the back-end.
 * @param req The incoming request.
 * @param res The outgoing response.
 */
export default async function handler(req, res) {
  const session: any = await getSession({ req });

  let status: number = 400;
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/admin/topic/upload`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
    body: JSON.stringify(req.body),
  })
    .then((response) => { status = response.status; });

  return res.status(status).end();
}
