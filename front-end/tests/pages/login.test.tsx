/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { shallow } from 'enzyme';
import LoginPage from '@pages/login';
import Login from '@components/Login/Login';

describe('/login', () => {
  test('Renders', () => {
    const wrapper = shallow(<LoginPage />);
    expect(wrapper.contains(<Login />)).toEqual(true);
  });
});
