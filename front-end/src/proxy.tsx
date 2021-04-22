/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences
 */

/**
 * # Proxies
 *
 * Any request using sessions should be made from the Node.js server instead of the browser.
 * To do this, create api endpoints in this project.
 * These can be defined in `src/pages/api/`.
 *
 * The reasoning behind this is that the NextAuth.js library runs on the serverside of Node.js
 * (not in the browser of whoever is visiting the website).
 * Because of this, Node.js holds the session on behalf of any visitors to the website.
 * The browser cannot use these session, therefore cannot authenticate with the back-end.
 *
 * The way to make authenticated requests is as follows:
 * 1. The browser makes a request to the Node.js server.
 * 2. The Node.js server uses the `sessionid` in the session in a fetch request
 * to make the authenticated call on behalf of the browser (see example below).
 * 3. The Node.js server receives the response from the back-end.
 * 4. The Node.js server sends the data the browser needs in a response back to the browser.
 *
 * ## Example
 *
 * This is the request to the back-end inside the api endpoint:
 * ```typescript
 * export default async function handler(req, res) {
 *  const session = await getSession({ req });
 *  await fetch(`{process.env.NEXT_PUBLIC_BASE_URL_NODE}/endpoint`, {
 *    method: 'GET',
 *    credentials: 'include',
 *    headers: {
 *     cookie: session.user.sessionid,
 *    },
 *  });
 *
 * return res.status(200);
 * }
 * ```
 *
 * This is the request to the front-end api,
 * from inside a React component or page running in the browser.
 * ```typescript
 * fetch(`{process.env.NEXT_PUBLIC_FE_URL}/api/endpoint`, {
 *  method: 'GET',
 * });
 * ```
 *
 * For a real-world example, see `src/pages/api/admin/pending`
 * in combination with the {@link AdminPage}'s `getUsers` function.
 *
 * ## Future development
 *
 * **Important**
 *
 * We highly recommend making *all* requests from the browser to the back-end use proxies
 * (even those without authentication!).
 * This includes any new requests *and* refactoring any old requests.
 * Many old requests in this project did not use this proxy technique,
 * they should all be refactored.
 * Ideally, the back-end should be hidden from any browser requests
 * and only be accessible from the Node.js server.
 * This gives consistency and fixes the {@link Docker} issue.
 *
 * @packageDocumentation
 * @module Proxy
 */
export {};
