/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { getSession } from 'next-auth/client';

/**
 * Post the user approval to the back-end.
 * @param req The incomming request
 * @param res The outgoing response
 */
export default async function handler(req, res) {
  const session: any = await getSession({ req });

  let status: number = 500;
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/admin/approval`, {
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
