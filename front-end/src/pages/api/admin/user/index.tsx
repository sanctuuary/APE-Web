import { getSession } from 'next-auth/client';
import UserInfo from '@models/User';

/**
 * Handle GET requests.
 * @param res The outgoing response.
 * @param session The current session.
 */
async function handleGET(res: any, session: any) {
  let users: UserInfo[];

  const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/user/`;
  await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
  })
    .then((response) => response.json())
    .then((data) => { users = data; });

  return res.status(200).json(users);
}

/**
 * Handle incoming requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 */
export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });
  const { method } = req;

  switch (method) {
    case 'GET':
      return handleGET(res, session);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
