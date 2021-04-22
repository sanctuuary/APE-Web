/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { signIn } from 'next-auth/client';

/**
 * Fetch the given request. If the response status is 403, redirect to the
 * login page.
 * @param input Regular fetch RequestInfo
 * @param init Regular fetch RequestInit
 * @returns Promise of request response after login succeeds
 * @deprecated This function has been made obsolete by the NextAuth.js library.
 * It is still used in {@link ExplorePage}, but hasn't been replaced yet. Don't
 * reuse it.
 */
export default async function fetchWithRedirect(
  input: RequestInfo,
  init?: RequestInit,
): Promise<Response> {
  return fetch(input, init).then((res: Response) => {
    if (res.status === 403) {
      // Not logged in, redirect to login page
      signIn();
    }
    // Login succeeded, continue as usual
    return res;
  });
}
