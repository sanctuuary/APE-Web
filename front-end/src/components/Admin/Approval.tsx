/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { useState } from 'react';
import { Table, Space, Button } from 'antd';
import ApprovalRequest from '@models/ApprovalRequest';

/**
 * Parse the input from the back-end. Also used in the tests.
 * @param input - The data received by the fetch. Contains:
 * id (string),
 * creationDate (string),
 * email (string),
 * displayName (string),
 * motivation (string)
 *
 * @return A list of parsed requests
 */
export function parseApprovalRequests(input: {
  id: string,
  creationDate: string,
  email: string,
  displayName: string,
  motivation: string
}[]): ApprovalRequest[] {
  return input.map((value) => ({
    id: value.id,
    creationDate: new Date(value.creationDate),
    email: value.email,
    displayName: value.displayName,
    motivation: value.motivation,
  }));
}

interface ApprovalProps {
  approvalRequests: ApprovalRequest[];
  postUserStatus: (request: ApprovalRequest, status: string) => Promise<void>;
}

/**
 * Component showing a list of users needing approval.
 *
 * Allows viewing, approving, and denying approval requests.
 */
function Approval(props: ApprovalProps) {
  const { approvalRequests, postUserStatus } = props;
  // The loading boolean for each row. Used for the approve/decline buttons.
  const [loading, setLoading] = useState(false);

  // The columns that will be shown in the Table
  const columns = [
    {
      title: 'Date',
      render: (request: ApprovalRequest) => {
        const options: Intl.DateTimeFormatOptions = {
          day: 'numeric', month: 'long', year: 'numeric',
        };
        return new Date(request.creationDate).toLocaleDateString('en-GB', options);
      },
    },
    {
      title: 'Name',
      dataIndex: 'displayName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Approve/Decline',
      render: (request: ApprovalRequest) => {
        const postStatus = async (status: string) => {
          setLoading(true);
          postUserStatus(request, status)
            .then(() => setLoading(false));
        };

        // Return a Space with two buttons, one for approval and the other for denial
        return (
          <Space size="middle">
            <Button
              onClick={() => postStatus('Approved')}
              data-testid="approve-button"
              loading={loading}
            >
              Approve
            </Button>
            <Button
              onClick={() => postStatus('Denied')}
              data-testid="deny-button"
              loading={loading}
            >
              Deny
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<ApprovalRequest>
      data-testid="user-table"
      columns={columns}
      expandable={{
        // When a column is expanded, show the motivation
        expandedRowRender: (request: ApprovalRequest) => (
          <p data-testid={`motivation-${request.id}`}>{request.motivation}</p>
        ),
      }}
      dataSource={approvalRequests}
      rowKey={(request: ApprovalRequest) => request.id}
    />
  );
}

export default Approval;
