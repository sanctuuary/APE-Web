/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render } from '@testing-library/react';
import Footer from '@components/Footer/Footer';

describe('Footer', () => {
  test('Renders copyright notice', () => {
    const { getByText } = render(<Footer />);
    const copyrightElement = getByText(/Utrecht University \(ICS\)/i);
    expect(copyrightElement).toBeInTheDocument();
  });

  test('Renders license link', () => {
    const { getByText } = render(<Footer />);
    const linkElement = getByText(/License/i);
    expect(linkElement).toBeInTheDocument();

    // Check if the element has the right link
    expect(linkElement).toHaveAttribute(
      'href',
      'https://github.com/sanctuuary/APE-Web/blob/master/LICENSE',
    );
  });

  test('Renders contact link', () => {
    const { getByText } = render(<Footer />);
    const linkElement = getByText(/Contact/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('Renders website logo', () => {
    const { getByAltText } = render(<Footer />);

    // Get the website logo <img> by the alt text
    const image = getByAltText(/Website logo/i);
    expect(image).toBeInTheDocument();

    // Check if the image is in a link element with the correct link
    expect(image.parentElement).toHaveAttribute(
      'href',
      '/',
    );
  });

  test('Renders APE link', () => {
    const { getByAltText } = render(<Footer />);

    // Get the APE logo <img> by the alt text
    const image = getByAltText(/APE logo/i);
    expect(image).toBeInTheDocument();

    // Check if the image is in a link element with the correct link
    expect(image.parentElement).toHaveAttribute(
      'href',
      'https://github.com/sanctuuary/APE',
    );
  });

  test('Renders GitHub link', () => {
    const { getByAltText } = render(<Footer />);
    // Get the GitHub logo <img> by the alt text
    const image = getByAltText(/GitHub logo/i);
    expect(image).toBeInTheDocument();

    // Check if the image is in a link element with the correct link
    expect(image.parentElement).toHaveAttribute(
      'href',
      'https://github.com/sanctuuary/APE-Web',
    );
  });

  test('Renders University Utrecht link', () => {
    const { getByAltText } = render(<Footer />);
    // Get the University Utrecht logo <img> by the alt text
    const image = getByAltText(/University Utrecht logo/i);
    expect(image).toBeInTheDocument();

    // Check if the image is in a link element with the correct link
    expect(image.parentElement).toHaveAttribute(
      'href',
      'https://www.uu.nl/en',
    );
  });
});
