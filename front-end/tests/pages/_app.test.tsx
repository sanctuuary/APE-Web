/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { ComponentType } from 'react';
import { shallow } from 'enzyme';
import MyApp from '@pages/_app';
import Home from '@pages/index';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';

describe('_app', () => {
  test('Renders', () => {
    // Shallow render
    const c: ComponentType<{}> = Home;
    const wrapper = shallow(<MyApp Component={c} router={null} />);

    // Get the top-level Layout component in MyApp
    const layout = wrapper.find('Layout');
    // Check if expected components are present
    expect(layout.contains(<Header />)).toEqual(true);
    expect(layout.contains(<Home />)).toEqual(true);
    expect(layout.contains(<Footer />)).toEqual(true);
  });
});
