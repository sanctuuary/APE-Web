/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { shallow } from 'enzyme';
import CreateDomain from '@pages/domain/new';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';

describe.skip('/create-domain', () => {
  // Test if the DomainCreate component is rendered
  test('Renders', () => {
    const wrapper = shallow(<CreateDomain />);
    expect(wrapper.contains(<DomainCreate />)).toEqual(true);
  });
});
