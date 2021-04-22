/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Explore from '@components/Explore/Explore';
import TestWorkflow from '../data/TestWorkflow';

jest.mock('@components/Explore/Sidebar/SidebarItem');

// ResizeObserver mock
class ResizeObserver {
  // eslint-disable-next-line class-methods-use-this
  observe() {
    // Do nothing
  }

  // eslint-disable-next-line class-methods-use-this
  unobserve() {
    // Do nothing
  }
}

Object.defineProperty(window, 'ResizeObserver', { value: ResizeObserver });

describe('Sidebar', () => {
  let boxes;
  let screen;
  const workflows = Array(20).fill(TestWorkflow);
  beforeAll(() => {
    /**
     * There seems to be an issue in either Jest or the React Flow library
     *
     * A warning will occur during unit testing,
     * saying the width and height of the React Flow parent element need to be set.
     * Whatever we do, the warning persists (but only in this test, not on the actual page).
     * To get rid of this warning, the console.warn method is ignored.
     */
    jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {})
      .mockReset();
    screen = render(<Explore workflows={workflows} />);
    boxes = screen.getAllByRole('checkbox');
  });

  it('Should render the selected workflows', () => {
    userEvent.click(boxes[3]);
    let workflow4 = screen.queryByTestId('Workflow 4');
    expect(workflow4).toBeInTheDocument();
    userEvent.click(boxes[7]);
    expect(screen.queryByTestId('Workflow 8')).toBeInTheDocument();
    userEvent.click(boxes[2]);
    let workflow3 = screen.queryByTestId('Workflow 3');
    userEvent.click(boxes[3]);
    workflow3 = screen.queryByTestId('Workflow 3');
    workflow4 = screen.queryByTestId('Workflow 4');
    expect(workflow4).toBeNull();
    expect(workflow3).toBeInTheDocument();
  });
});
