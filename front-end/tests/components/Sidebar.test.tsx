/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Sidebar from '@components/Explore/Sidebar/Sidebar';
import TestWorkflow from '../data/TestWorkflow';

jest.mock('@components/Explore/Sidebar/SidebarItem');

describe('Sidebar', () => {
  beforeAll(() => {
    /*
     * There seems to be an issue in either Jest or the React Flow library
     *
     * A warning will occur during unit testing,
     * saying the width and height of the React Flow parent element need to be set.
     * Whatever we do, the warning persists (but only in this test, not on the actual page).
     * To get rid of this warning, the console.warn method is ignored.
     */
    jest.spyOn(console, 'warn').mockImplementation(() => {}).mockReset();
  });

  let workflows;
  let boxes;
  let screen;
  beforeEach(() => {
    workflows = Array(20).fill(TestWorkflow);
    screen = render(<Sidebar workflows={workflows} onSelect={jest.fn()} />);
    boxes = screen.getAllByRole('checkbox');
  });

  it('Should have as many children as the workflow length', () => {
    expect(boxes.length).toBe(workflows.length);
    cleanup(); // Manual cleanup so we can retest within the same test.
    workflows = Array(12).fill(TestWorkflow);
    boxes = render(<Sidebar workflows={workflows} onSelect={jest.fn()} />).getAllByRole('checkbox');
    expect(boxes.length).toBe(workflows.length);
  });

  it('Should check the checkbox if the user presses it and uncheck when pressed again', () => {
    expect(boxes[0].checked).toBe(true);
    expect(boxes[5].checked).toBe(false);
    userEvent.click(boxes[0]);
    userEvent.click(boxes[5]);
    expect(boxes[0].checked).toBe(false);
    expect(boxes[5].checked).toBe(true);
    userEvent.click(boxes[0]);
    expect(boxes[0].checked).toBe(true);
    expect(boxes[5].checked).toBe(true);
    userEvent.click(boxes[5]);
    expect(boxes[5].checked).toBe(false);
  });
});
