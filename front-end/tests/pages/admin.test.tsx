/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { mount } from 'enzyme';
import AdminPage from '@pages/admin';
import Approval from '@components/Admin/Approval';
import fetchMock from 'jest-fetch-mock';
import { testData } from '../data/approvalRequests';

describe.skip('/admin', () => {
  // Test if the Admin component is rendered
  test('Renders', (done) => {
    // Mock fetch to respond with the testData
    fetchMock.mockResponseOnce(JSON.stringify(testData));

    const wrapper = mount(<AdminPage />);

    /*
     * When the component mounts, the order of calls is:
     * constructor, render, componentDidMount
     *
     * The wrapper needs to re-render with the new state.
     * The state gets updated by setImmediate and then the
     * re-render is done with wrapper.update(). After everything
     * is done, call the DoneCallback function done().
     */
    setImmediate(() => {
      wrapper.update();
      expect(wrapper.contains(
        <Approval />,
      )).toEqual(true);

      done();
    });
  });

  test('approval request fetch error catch', () => {
    // Reject the next fetch request
    fetchMock.mockRejectOnce(() => Promise.reject());
    // Assert we get the error message we expect
    jest.spyOn(console, 'error')
      .mockImplementation((message) => expect(message).toEqual('Pending requests error'));

    // Mount the page, trigger a fetch
    mount(<AdminPage />);
  });
});
