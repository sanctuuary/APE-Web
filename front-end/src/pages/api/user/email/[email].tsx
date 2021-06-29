import { getSession } from 'next-auth/client';

/**
 * Handle GET requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 * @param session The current session.
 */
async function handleGET(req: any, res: any, session: any) {
  const { email } = req.query;
  const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/user/email/${email}`;
  await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
    },
  })
    .then(async (response) => {
      if (!response.ok) {
        const message = await response.json().then((e) => e.message);
        throw new Error(message);
      }
      return response.json();
    })
    .then((data) => res.status(200).json(data))
    .catch(() => res.status(200).json({ found: false }));
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
      return handleGET(req, res, session);
    default:
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
