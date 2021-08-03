/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { getSession } from 'next-auth/client';
import FormData from 'formdata-node';
import Blob from 'fetch-blob';
import { FileContent } from '@helpers/Files';

/**
 * Proxy endpoint for uploading domains
 */
export default async function handler(req, res) {
  const session: any = await getSession({ req });

  let result: Response;
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/upload`;

  // Create form data
  const { values, fileContents } = req.body;
  const formdata = new FormData();
  Object.keys(values).forEach((key) => {
    /*
     * Topics and dataDimensionsTaxonomyRoots should be handled separately, skip them here.
     *
     * They should be handled separately, because in the case of arrays,
     * each element in the array should be its own FormData entry.
     * Otherwise, all elements in the array are received as one element on the back-end.
     */
    if (key !== 'topics' && key !== 'dataDimensionsTaxonomyRoots') {
      formdata.append(key, values[key]);
    }
  });
  // Add topics
  Object.values(values.topics).forEach((topic: string) => formdata.append('topics', topic));
  Object.values(values.dataDimensionsTaxonomyRoots).forEach((root: string) => formdata.append('dataDimensionsTaxonomyRoots', root));

  fileContents.forEach((fc: FileContent) => {
    formdata.append(
      fc.id,
      new Blob([fc.content], { type: 'text/plain' }),
      fc.fileName,
    );
  });

  // Send request
  await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
      'Content-Type': formdata.headers['Content-Type'],
    },
    body: formdata.stream as any,
  })
    // Parse response
    .then((response) => { result = response; });

  // Pass on the result
  return res.json(result);
}
