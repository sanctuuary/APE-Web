import { getSession } from 'next-auth/client';

/**
 * Handle incoming requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 */
export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });
  const { id } = req.query;
  const { body } = req;

  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/${id}/transfer/${body}`;
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
  })
    .then((response) => {
      switch (response.status) {
        case 200:
          // Ownership transferred
          res.status(200).json({ outcome: 0 });
          break;
        case 403:
          // User is not allowed to transfer the domain ownership.
          res.status(200).json({ outcome: 1 });
          break;
        case 404:
          /*
           * User to transfer ownership to was not found, or the domain was not found
           * (but this is highly unlikely because the domain id was handled automatically).
           */
          res.status(200).json({ outcome: 2 });
          break;
        default:
          res.status(response.status).json();
          break;
      }
    })
    .catch(() => res.status(500).end());
}
