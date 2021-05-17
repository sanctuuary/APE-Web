import { getSession } from 'next-auth/client';
import { RunOptions } from '@models/workflow/Workflow';

/**
 * Handle PUT requests.
 * @param res The outgoing response.
 * @param session The current session.
 * @param runParameters The run parameters PUT by the front-end.
 */
async function handlePUT(res: any, session: any, runParameters: RunOptions) {
  let status: number = 400;

  const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/admin/runparameters/${runParameters.id}`;
  await fetch(endpoint, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
    body: JSON.stringify(runParameters),
  })
    .then((response) => { status = response.status; });

  return res.status(status).end();
}

/**
 * Handle incoming requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 */
export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });
  const { method, body } = req;

  switch (method) {
    case 'PUT':
      return handlePUT(res, session, body);
    default:
      res.setHeader('Allow', ['PUT']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
