/* eslint-disable max-len */
/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences
 */

/**
 * # Project structure
 *
 * The project is divided into two sections:
 * - `src`: The source code for the website.
 * - `tests`: The unit tests for the website.
 *
 * The source directory divides files into five categories:
 * - `components`: The React components used in the pages.
 * - `helpers`: reusable global helper functions.
 * - `models`: type definitions which don't belong to a single component and are used in multiple places.
 * - `pages`: the web pages.
 * - `styles`: global style definitions.
 *
 * The tests directory divides files into four categories:
 * - `components`: Unit tests for the React components.
 * - `data`: Reusable mock objects for tests.
 * - `helpers`: Unit tests for the helper functions.
 * - `pages`: Unit tests for the web pages.
 *
 * ---
 *
 * ## Components
 *
 * Components are modular and reusable parts of the website.
 * They can be a form, a data view, header, footer, etc.
 * They are defined in `src/components`.
 *
 * All components are put into separate directories, grouping related components together.
 * For example: components for viewing, creating, and editing domains are in
 * `src/components/Domain/`.
 *
 * ---
 *
 * ## Pages
 *
 * All visitable pages of the website are defined in `src/pages`.
 *
 * The directories and files automatically define the URL paths for the website.
 * For example, `index.tsx` is `/` and `about.tsx` is `/about`.
 *
 * A file with brackets defines url parameters.
 * For example, `explore/[id].tsx` defines the path `/explore/[id]` where \[id\] is the id for the domain to be used on the page.
 * These URL parameters can be used by the page via `getServerSideProps`.
 * In the case of the explore page it gathers the domain id via `query.id`.
 * For more information see the [Next.Js documentation on pages](https://nextjs.org/docs/basic-features/pages).
 *
 * The pages `about`, `contact`, and `privacy` are static pages with information for users.
 *
 * ---
 *
 * ## Tests
 *
 * The tests are divided into components, pages, and helpers tests.
 * The directories are structures the same as the components and pages directories to increase readability.
 * The data directory contains re-usable mock data used in multiple tests.
 *
 * ### Component tests
 *
 * Components tests perform unit tests on the components.
 * They test if a component renders properly given a set of props,
 * and if each function withing a component performs as intended.
 *
 * ### Page tests
 *
 * Page tests test if a page renders properly when given certain data.
 * This is done by giving the page mock props and/or mocking the fetch responses.
 *
 * ### Mocking fetch requests
 *
 * Fetch requests responses can be mocked using the
 * [Jest Fetch Mock](https://github.com/jefflau/jest-fetch-mock#api) library.
 *
 * For example, mocking the next response:
 * ```typescript
 * const user = {
 *   displayName: 'Test',
 *   userId: '5fa93b04b4a9d25d78e0a312',
 *   email: 'test@test.com',
 *   status: 'Approved',
 * };
 * fetchMock.mockResponseOnce(JSON.stringify(user));
 * ```
 * These can placed one after another to mock all responses to fetches a component or page makes.
 *
 * ### Testing Ant Design components
 *
 * Ant Design components have proven to be difficult to test.
 * They are not fully compatible with the standard React testing libraries like Jest and Testing Library.
 * As a workaround, you can use the [shallow renderer from Enzyme](https://enzymejs.github.io/enzyme/docs/api/shallow.html).
 * This allows you to find the Ant Components and check their states.
 *
 * For example, finding the Ant Design Select component within DomainCreate:
 * ```typescript
 * const wrapper = shallow(<DomainCreate />);
 * const select = wrapper.find('Select');
 * ```
 *
 * @packageDocumentation
 * @module Structure
 */
export {};
