/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { shallow } from 'enzyme';
import fetchMock from 'jest-fetch-mock';
import DomainList from '@components/Domain/DomainList/DomainList';
import DomainsPage, { getServerSideProps } from '@pages/index';
import { twoMockDomains } from '@tests/data/Domain';

describe.skip('/', () => {
  it('Renders', () => {
    const wrapper = shallow(<DomainsPage domains={twoMockDomains} />);
    expect(wrapper.contains(<DomainList domains={twoMockDomains} edit={false} />)).toEqual(true);
  });

  it('Loads the domains correctly', () => {
    const wrapper = shallow(<DomainsPage domains={twoMockDomains} />);
    const domainList: any = wrapper.find('DomainList');

    expect(domainList.props().domains).toEqual(twoMockDomains);
  });

  it('Fetches the domains correctly', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(twoMockDomains), { status: 200 });

    const response = await getServerSideProps();
    expect(response).toEqual({
      props: {
        domains: twoMockDomains,
      },
    });
  });
});
