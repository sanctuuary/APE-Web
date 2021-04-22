/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { shallow } from 'enzyme';
import RegisterPage from '@pages/register';
import RegisterForm from '@components/Login/RegisterForm';

describe('/register', () => {
  it('Renders', () => {
    const wrapper = shallow(<RegisterPage />);
    expect(wrapper.contains(<RegisterForm />)).toEqual(true);
  });
});
