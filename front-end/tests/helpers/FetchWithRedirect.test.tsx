/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import fetchMock from 'jest-fetch-mock';
import fetchWithRedirect from '@helpers/FetchWithRedirect';

describe('FetchWithRedirect', () => {
  it('Returns the requested data', async () => {
    const testObject = {
      title: 'Test',
      description: 'Test object',
    };

    fetchMock.mockResponseOnce(
      JSON.stringify(testObject),
      { status: 200 },
    );

    await fetchWithRedirect('url', {
      method: 'GET',
    })
      .then((response) => response.json())
      // Expect right object to be returned
      .then((data) => expect(data).toEqual(testObject));
  });

  // Can't test whether it redirects??
  it('Redirects if not logged in', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({}),
      { status: 403 },
    );

    await fetchWithRedirect('url', {
      method: 'GET',
    })
      .then((response) => response.json())
      // Expect right object to be returned
      .then((data) => expect(data).toEqual({}));
  });
});
