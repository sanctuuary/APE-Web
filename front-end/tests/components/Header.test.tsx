/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import { shallow } from 'enzyme';
import Header from '@components/Header/Header';

/*
 * We mock ant-design's Dropdown here.
 * Otherwise ant-design hides the overlay internally,
 * which is the menu with our links in this case.
 * This causes jest to be unable to find them then.
 * We also disable the eslint rule because there is no need
 * to verify the props as they are part of the ant-design component.
 */
jest.mock('antd', () => {
  const antd = jest.requireActual('antd');

  // eslint-disable-next-line react/prop-types
  const Dropdown = ({ overlay }) => <div>{overlay}</div>;
  return {
    ...antd,
    Dropdown,
  };
});

describe('Header', () => {
  let screen;
  beforeEach(() => {
    screen = render(<Header />);
  });
  it('contains the logo', () => {
    const { getByAltText } = screen;
    expect(getByAltText(/logo/i)).toBeInTheDocument();
  });

  it('renders the navigation links', () => {
    const { getByText } = screen;
    expect(getByText(/Login/i)).toBeInTheDocument();
    /*
     * Call this prop function just for coverage
     * Function is originally used to make sure the dropdown
     * moves along with the header when the users scrolls on the page.
     */
    const dropdown = shallow(<Header />).find('Dropdown');
    dropdown.props().getPopupContainer(dropdown);
  });
});

jest.clearAllMocks();
