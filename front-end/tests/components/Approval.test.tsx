/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { render, getByText, queryByAttribute, queryByTestId, getByTestId } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Approval from '@components/Admin/Approval';
import ApprovalRequest from '@models/ApprovalRequest';
import fetchMock from 'jest-fetch-mock';
import { testData, parsedTestData } from '../data/approvalRequests';

describe.skip('Approval', () => {
  let table: HTMLTableElement;

  beforeEach(() => {
    fetchMock.mockResponseOnce(JSON.stringify(testData));
    const renderResult = render(<Approval />);
    table = renderResult.getByRole('table') as HTMLTableElement;
  });

  // After each test, reset the mocks
  afterEach(() => fetchMock.resetMocks());

  test('render columns', () => {
    /*
     * Test if all columns are rendered. If more columns are added,
     * add those values to the array.
     */
    ['Date', 'Name', 'Email'].forEach((header: string) => {
      expect(getByText(table.tHead, header)).toBeInTheDocument();
    });
  });

  test('expand record (show motivation)', () => {
    /*
     * For each user, test the expansion button. Ant Design works by rendering the
     * expanded row after the first press of the button, so check if the motivation
     * is first null, then if it's visible, then if it is not visible anymore.
     */
    parsedTestData.forEach((request: ApprovalRequest) => {
      const key = request.id;

      // Get the record by the Ant Design data-row-key. Expect it to be in the document.
      const record = queryByAttribute('data-row-key', table, key);
      expect(record).toBeInTheDocument();

      // Try to get the motivation paragraph (expect to fail).
      let motivation = queryByTestId(record.parentElement, `motivation-${key}`);
      expect(motivation).toBeNull();

      // Get the expand button and click it.
      const button = queryByAttribute('aria-label', record, 'Expand row');
      userEvent.click(button);

      // Rerun the query (expect to succeed) and see if the paragraph is visible.
      motivation = queryByTestId(record.parentElement, `motivation-${key}`);
      expect(motivation).toBeVisible();

      // Collapse the motivation again and see if the paragraph is not visible anymore.
      userEvent.click(button);
      expect(motivation).not.toBeVisible();
    });
  });

  test('approve/deny buttons', () => {
    parsedTestData.forEach((request: ApprovalRequest) => {
      const key = request.id;

      // Get the data-row
      const record = queryByAttribute('data-row-key', table, key);

      // Get the buttons and expect them to be in the document
      const approveButton = getByTestId(record, 'approve-button');
      const denyButton = getByTestId(record, 'deny-button');

      expect(approveButton).toBeInTheDocument();
      expect(denyButton).toBeInTheDocument();

      // The expected bodies
      const fakeApproval = {
        requestId: request.id,
        email: request.email,
        status: 'Approved',
      };
      const fakeDenial = {
        requestId: request.id,
        email: request.email,
        status: 'Denied',
      };

      /*
       * Mock the fetch. For now, just return 201 status
       * TODO: implement call sanity check
       */
      fetchMock.doMockIf(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/approval`,
        () => Promise.resolve({ status: 201 }));

      /*
       * Click the approve button, expect the next (index = 0)
       * fetch body to be equal to fakeApproval
       */
      userEvent.click(approveButton);
      expect(fetchMock.mock.calls[0][1].body).toEqual(JSON.stringify(fakeApproval));

      /*
       * Click the approve button, expect the next (index = 1)
       * fetch body to be equal to fakeApproval
       */
      userEvent.click(denyButton);
      expect(fetchMock.mock.calls[1][1].body).toEqual(JSON.stringify(fakeDenial));

      // Reset the mocks, so the calls stack gets deleted
      fetchMock.resetMocks();
    });
  });

  test('Approve/deny error catch', () => {
    fetchMock.mockReject(() => Promise.reject());
    // Assert we get the error message we expect
    jest.spyOn(console, 'error')
      .mockImplementation((message) => expect(message).toEqual('Approve/Deny error'));

    // Test on the first element in the list
    const key = parsedTestData[0].id;
    const record = queryByAttribute('data-row-key', table, key);

    // Get the buttons and expect them to be in the document
    const approveButton = getByTestId(record, 'approve-button');
    const denyButton = getByTestId(record, 'deny-button');

    userEvent.click(approveButton);
    userEvent.click(denyButton);
  });
});
