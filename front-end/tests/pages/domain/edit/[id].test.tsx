/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { mount } from 'enzyme';
import { act } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import DomainEditPage, { getServerSideProps } from '@pages/domain/edit/[id]';
import { mockDomain, mockTopics } from '@tests/data/Domain';

describe.skip('/domain/edit/[id]', () => {
  it('Renders', async (done) => {
    fetchMock
      .mockResponseOnce(JSON.stringify(mockDomain))
      .mockResponseOnce(JSON.stringify(mockTopics));
    const wrapper = mount(<DomainEditPage domainID="1" />);

    // State changes should be wrapped in act
    await act(() => new Promise<void>(() => {
      // Use setImmediate + wrapper.update() to let the page re-render
      setImmediate(() => {
        wrapper.update();
        expect(wrapper.find('DomainEdit').exists()).toBe(true);
        done();
      });
    }));
  });

  it('Fetches required resources properly', () => {
    const response = getServerSideProps({ query: { id: '1' } });
    expect(response).toEqual({
      props: {
        domainID: '1',
      },
    });
  });

  it('Shows domain not found result when no domain is found', async (done) => {
    fetchMock
      .mockResponseOnce(JSON.stringify({}), { status: 500 })
      .mockResponseOnce(JSON.stringify(mockTopics));
    const wrapper = mount(<DomainEditPage domainID="1" />);

    // State changes should be wrapped in act
    await act(() => new Promise<void>(() => {
      // Use setImmediate + wrapper.update() to let the page re-render
      setImmediate(() => {
        wrapper.update();
        expect(wrapper.find('Result').exists()).toBe(true);
        done();
      });
    }));
  });
});
