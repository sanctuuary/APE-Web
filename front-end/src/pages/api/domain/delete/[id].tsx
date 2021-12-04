import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session: any = await getSession({ req });
  const { id }: { id: number } = req.query;

  let result: Response;
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/delete/${id}`;
  await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
    },
  })
    // Get the response from the back-end
    .then((response) => { result = response; });

  // Pass on the result
  return res.json(result);
}
