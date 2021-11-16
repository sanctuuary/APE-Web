/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { getSession } from 'next-auth/client';
import ApprovalRequest from '@models/ApprovalRequest';
import { parseApprovalRequests } from '@components/Admin/Approval';

/**
 * Get the pending user requests from the back-end.
 * @param req The incoming request
 * @param res The outgoing response
 */
export default async function handler(req, res) {
  const session: any = await getSession({ req });

  let requests: ApprovalRequest[] = [];
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/admin/pending-requests`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
    },
  })
    .then((response) => response.json())
    .then((json) => { requests = parseApprovalRequests(json); })
    // TODO: error should be passed to the browser instead of logging to Node.js console.
    .catch((error) => console.error('Pending requests error', error));

  // Set the response
  return res.status(200).json(requests);
}
