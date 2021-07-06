import { UserAccessUpload, UserWithAccess } from '@models/Domain';
import { getSession } from 'next-auth/client';

/**
 * GET the users with access to the domain and their access levels.
 * @param res The outgoing response.
 * @param session The current session.
 * @param domainId The id of the domain to get users with access of it.
 * @param accessLevels The access levels the users may have.
 * @returns A response to the caller of this api endpoint.
 */
async function handleGET(res: any, session: any, domainId: string, accessLevels: any) {
  let result: UserWithAccess[] | number;

  const accessRights = accessLevels.join(',');
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/users-with-access/${domainId}?accessRights=${accessRights}`;
  await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
    },
  })
    .then((response) => {
      if (response.status !== 200) {
        return response.status;
      }
      return response.json();
    })
    .then((data) => { result = data; });

  // If an error occurred, return the HTTP status code.
  if (typeof result === 'number') {
    return res.status(result).end();
  }
  return res.status(200).json(result);
}

/**
 * POST the access right of a user to the back-end.
 * @param res The outgoing response.
 * @param session The current session.
 * @param domainId The id of the domain to which rights are given.
 * @param userAccess The user and access level.
 */
async function handlePOST(res: any, session: any, domainId: string, userAccess: UserAccessUpload) {
  let result: number;

  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/${domainId}/access`;
  await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: session.user.sessionid,
    },
    body: JSON.stringify(userAccess),
  })
    .then((response) => { result = response.status; });

  return res.status(result).end();
}

/**
 * Handle incoming requests.
 * @param req The incoming request.
 * @param res The outgoing response.
 * @returns A response to the caller of this api endpoint.
 */
export default async function handler(req: any, res: any) {
  const session: any = await getSession({ req });
  const { method } = req;
  const { slug } = req.query;

  switch (method) {
    case 'GET':
      return handleGET(res, session, slug[0], slug.slice(1, slug.length));
    case 'POST': {
      const { body } = req;
      return handlePOST(res, session, slug[0], body);
    }
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
