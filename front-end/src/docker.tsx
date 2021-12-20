/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences
 */

/**
 * # Docker issue
 *
 * Currently, there is an issue when deploying this project in Docker.
 * Fetch requests to the back-end can be made from the Node.js environment on the server
 * (inside the Docker container),
 * or from the browser (outside the Docker container).
 * Because communication between Docker containers happens via Docker networks,
 * Node.js calls the back-end via an alias.
 * However, web browsers can not use this alias.
 * Therefore both need to call a different URL to make fetch requests.
 *
 * ## Workaround
 *
 * To work around this issue, the environment file defines two base URLs:
 * - `NEXT_PUBLIC_BASE_URL_NODE`: for Node.js to call the back-end via an alias.
 * - `NEXT_PUBLIC_BASE_URL`: for web browsers to call the back-end.
 *
 * ## Possible fix in the future
 *
 * To fix this issue, [Next.js' API routes](https://nextjs.org/docs/api-routes/introduction) could be used.
 * Both the browser and Node would call endpoints in the `http://example/api/...` path,
 * which are defined in `src/pages/api/`.
 * This front-end api serves as a proxy for the browser:
 * all fetch requests are made to the front-end, which passes on the request to the back-end.
 * The result from the back-end is then passed back to the browser.
 *
 * If this were to be implemented, the front-end would no longer need two separate URL definitions.
 * It would also allow the back-end Docker to no longer expose it's ports to the outside world.
 *
 * **Important**: see more information about this in the {@link Proxy} docs page.
 *
 * @packageDocumentation
 * @module Docker
 */
export {};
