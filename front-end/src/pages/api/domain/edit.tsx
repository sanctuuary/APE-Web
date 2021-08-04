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
 * Proxy endpoint for editing domains
 */
export default async function handler(req, res) {
  const {
    domain,
    values,
    fileContents,
    appliedTopics,
    topicsChanged,
  } = req.body;
  const changed = new FormData();

  // Add any changed data
  Object.keys(values).forEach((k) => {
    const original = domain[k];
    // Skip topics, will be added manually later
    if (k !== 'topics' && values[k] !== original) {
      changed.append(k, values[k]);
    }
  });
  // If new file were given by the user, add them to the payload
  fileContents.forEach((fc: FileContent) => {
    changed.append(
      fc.id,
      new Blob([fc.content], { type: 'text/plain' }),
      fc.fileName,
    );
  });

  // If the data dimensions taxonomy roots has been changed, format it correctly
  if (changed.get('dataDimensionsTaxonomyRoots') !== null) {
    const taxRoots: string = values.dataDimensionsTaxonomyRoots.toString();
    // Get the data dimensions taxonomy roots
    const formattedTaxRoots = taxRoots.split(',').map((w) => w.trim());
    changed.delete('dataDimensionsTaxonomyRoots');
    formattedTaxRoots.map((root: string) => changed.append('dataDimensionsTaxonomyRoots', root));
  }

  // Add topics of they are changed
  if (topicsChanged) {
    appliedTopics.map((topic: string) => changed.append('topics', topic));
  }

  // Send request
  const session: any = await getSession({ req });
  let result: Response;
  const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/domain/${domain.id}`;
  await fetch(endpoint, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      cookie: session.user.sessionid,
      'Content-Type': changed.headers['Content-Type'],
    },
    body: changed.stream as any,
  })
    .then((response) => {
      result = response;
    });

  return res.json(result);
}
