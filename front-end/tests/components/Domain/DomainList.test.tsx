/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { queryByAttribute, queryByTestId, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DomainList from '@components/Domain/DomainList/DomainList';
import Domain, { Visibility } from '@models/Domain';

describe('DomainList', () => {
  const testDomains: Domain[] = [
    {
      id: '1',
      title: 'Domain A',
      description: 'A domain used for testing.',
      visibility: Visibility.Public,
      topics: ['Topic 1', 'Topic 2'],
      ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
      toolsTaxonomyRoot: 'Tool',
      dataDimensionsTaxonomyRoots: ['Type', 'Format'],
    },
    {
      id: '2',
      title: 'Domain B',
      description: 'Another domain used for testing.',
      visibility: Visibility.Public,
      topics: ['Topic 3'],
      ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
      toolsTaxonomyRoot: 'Tool',
      dataDimensionsTaxonomyRoots: ['Type', 'Format'],
    },
    // Add domain with duplicate title to cover all alphabetical sorter function's cases
    {
      id: '3',
      title: 'Domain A',
      description: 'A third domain used for testing.',
      visibility: Visibility.Public,
      topics: ['Topic 4'],
      ontologyPrefixIRI: 'http://test.org/ontologies/test.owl#',
      toolsTaxonomyRoot: 'Tool',
      dataDimensionsTaxonomyRoots: ['Type', 'Format'],
    },
  ];

  let rendered;
  let page;

  beforeEach(() => {
    rendered = render(<DomainList domains={testDomains} />);
    const { container, getByText, getAllByText } = rendered;
    const domainA = getAllByText('Domain A')[0];
    const domainB = getByText('Domain B');

    const openSearch = container.querySelector('.anticon-search').parentElement;
    const openTopicFilter = container.querySelector('.anticon-filter').parentElement;

    page = { container, domainA, domainB, openSearch, openTopicFilter };
  });

  it('Renders', () => {
    expect(page.domainA).toBeInTheDocument();
    expect(page.domainB).toBeInTheDocument();
  });

  it('Can open name search dropdown', () => {
    userEvent.click(page.openSearch);
    const { getByPlaceholderText, getByTestId } = rendered;

    const searchNameInput = getByPlaceholderText('Search by name');
    const searchNameButton = getByTestId('searchNameButton');
    const searchNameReset = getByTestId('searchNameReset');

    expect(searchNameInput).toBeInTheDocument();
    expect(searchNameButton).toBeInTheDocument();
    expect(searchNameReset).toBeInTheDocument();
  });

  it('Can search by domain name using submit button', () => {
    // Test search by clicking the button
    userEvent.click(page.openSearch);
    const { getByPlaceholderText, getByTestId, getAllByText, queryByText, getByText } = rendered;

    const searchNameInput = getByPlaceholderText('Search by name');
    const searchNameButton = getByTestId('searchNameButton');

    userEvent.type(searchNameInput, 'Domain A');
    userEvent.click(searchNameButton);
    let domainA = getAllByText('Domain A');
    let domainB = queryByText('Domain B');

    expect(domainA[0]).toBeInTheDocument();
    expect(domainA[1]).toBeInTheDocument();
    expect(domainB).toBeNull();

    // Can reset search
    userEvent.click(page.openSearch);
    const searchNameReset = getByTestId('searchNameReset');
    userEvent.click(searchNameReset);
    domainA = getAllByText('Domain A');
    domainB = getByText('Domain B');

    expect(domainA.length).toEqual(2);
    expect(domainA[0]).toBeInTheDocument();
    expect(domainA[1]).toBeInTheDocument();
    expect(domainB).toBeInTheDocument();
  });

  it('Can search by domain name using enter', () => {
    // Test search by clicking the button
    userEvent.click(page.openSearch);
    const { getByPlaceholderText, getByTestId, getAllByText, queryByText } = rendered;

    const searchNameInput = getByPlaceholderText('Search by name');
    const searchNameButton = getByTestId('searchNameButton');

    userEvent.type(searchNameInput, 'Domain A');
    userEvent.type(searchNameButton, '{enter}');
    const domainA = getAllByText('Domain A');
    const domainB = queryByText('Domain B');

    expect(domainA.length).toEqual(2);
    expect(domainA[0]).toBeInTheDocument();
    expect(domainA[1]).toBeInTheDocument();
    expect(domainB).toBeNull();
  });

  it('Can open topic filter dropdown', () => {
    userEvent.click(page.openTopicFilter);
    const { getByText } = rendered;

    const topic1 = getByText('Topic 1');
    const topic2 = getByText('Topic 2');
    const topic3 = getByText('Topic 3');

    expect(topic1).toBeInTheDocument();
    expect(topic2).toBeInTheDocument();
    expect(topic3).toBeInTheDocument();
  });

  it('Can filter on topics', () => {
    userEvent.click(page.openTopicFilter);
    const { getByText, queryByText, getAllByText } = rendered;

    const topic1 = getByText('Topic 1');
    const topic2 = getByText('Topic 2');
    const ok = getByText(/OK/);

    userEvent.click(topic1);
    userEvent.click(topic2);
    userEvent.click(ok);

    let domainA = getAllByText('Domain A');
    let domainB = queryByText('Domain B');

    expect(domainA.length).toEqual(1);
    expect(domainA[0]).toBeInTheDocument();
    expect(domainB).toBeNull();

    // Can reset filter
    userEvent.click(page.openTopicFilter);
    const reset = getByText(/Reset/);
    userEvent.click(reset);

    domainA = getAllByText('Domain A');
    domainB = getByText('Domain B');

    expect(domainA.length).toEqual(2);
    expect(domainA[0]).toBeInTheDocument();
    expect(domainA[1]).toBeInTheDocument();
    expect(domainB).toBeInTheDocument();
  });

  /*
   * There is currently an edge case where selecting -> deselecting -> selecting filters
   * makes the topicFilters null.
   * Test this edge case.
   */
  test('onFilter filters are null edge case', () => {
    // Apply filter first time
    userEvent.click(page.openTopicFilter);
    const { getByText, queryByText, getAllByText } = rendered;

    const topic1 = getByText('Topic 1');
    const topic2 = getByText('Topic 2');
    const ok = getByText(/OK/);

    userEvent.click(topic1);
    userEvent.click(topic2);
    userEvent.click(ok);

    // Remove filter
    userEvent.click(page.openTopicFilter);
    userEvent.click(topic1);
    userEvent.click(topic2);
    userEvent.click(ok);

    // Apply filter second time
    userEvent.click(page.openTopicFilter);
    userEvent.click(topic1);
    userEvent.click(topic2);
    userEvent.click(ok);

    // Check if the filters work correctly and the edge case has been handled correctly
    const domainA = getAllByText('Domain A');
    const domainB = queryByText('Domain B');

    expect(domainA.length).toEqual(1);
    expect(domainA[0]).toBeInTheDocument();
    expect(domainB).toBeNull();
  });

  it('Can open open and close description', () => {
    // Use domain A to test
    const rowKey: string = '0';
    const { id } = testDomains[0];

    // Get the record by the Ant Design data-row-key. Expect it to be in the document.
    const table: HTMLTableElement = rendered.getByRole('table') as HTMLTableElement;
    const record = queryByAttribute('data-row-key', table, rowKey);
    expect(record).toBeInTheDocument();

    // Try to find the description paragraph, and expect to fail
    let description = queryByTestId(record.parentElement, `description-${id}`);
    expect(description).toBeNull();

    // Get the expand button and click it
    const button = queryByAttribute('aria-label', record, 'Expand row');
    expect(button).toBeInTheDocument();
    userEvent.click(button);

    // Check if the description is now visible
    description = queryByTestId(record.parentElement, `description-${id}`);
    expect(description).toBeVisible();

    // Check if the description is hidden again
    userEvent.click(button);
    expect(description).not.toBeVisible();
  });
});
