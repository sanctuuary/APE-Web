/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SidebarItem from '@components/Explore/Sidebar/SidebarItem';
import TestWorkflow from '../data/TestWorkflow';

describe('SidebarItem', () => {
  let label;
  let screen;
  beforeAll(() => {
    /**
     * There seems to be an issue in either Jest or the React Flow library
     *
     * A warning will occur during unit testing,
     * saying the width and height of the React Flow parent element need to be set.
     * Whatever we do, the warning persists (but only in this test, not on the actual page).
     * To get rid of this warning, the console.warn method is ignored once.
     */
    jest.spyOn(console, 'error').mockImplementationOnce(() => {});
  });

  beforeEach(() => {
    screen = render(
      <SidebarItem workflow={TestWorkflow} index={0} />,
    );
    label = screen.getByText('Workflow 1').parentElement;
  });

  it('Should be selected or deselected when mouse is pressed on it', () => {
    /*
     * Ugly, but getByRole does not seem to work, perhaps due to it being a 3rd party component.
     * That being said however, structure will always be the same then.
     */
    const box = label.firstChild.firstChild;
    expect(box.checked).toBe(false);
    userEvent.click(label);
    expect(box.checked).toBe(true);
    userEvent.click(label);
    expect(box.checked).toBe(false);
  });
});
