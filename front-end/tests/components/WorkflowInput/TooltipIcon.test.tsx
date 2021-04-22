/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import TooltipIcon from '@components/TooltipIcon/TooltipIcon';

describe('TooltipIcon', () => {
  it('Renders with string content', () => {
    const { getByRole } = render(<TooltipIcon content="Test" />);
    const icon = getByRole('img');

    expect(icon).toBeInTheDocument();
  });

  it('Renders with HTML content', () => {
    const { getByRole } = render(
      <TooltipIcon
        content={(
          <div>
            <h1>Non-string content</h1>
            <p>This is some html instead of a string.</p>
          </div>
        )}
      />,
    );
    const icon = getByRole('img');

    expect(icon).toBeInTheDocument();
  });
});
