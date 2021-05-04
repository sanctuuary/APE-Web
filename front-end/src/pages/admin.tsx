/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Button, message, Result, Typography } from 'antd';
import Approval from '@components/Admin/Approval';
import ApprovalRequest from '@models/ApprovalRequest';
import { getSession, signIn } from 'next-auth/client';
import TopicCreate from '@components/Admin/TopicCreate';
import styles from './Admin.module.scss';

const { Title } = Typography;

interface IState {
  requests: ApprovalRequest[];
}

interface IProps {
  session: any;
}

/**
 * The page for the administrators.
 * They use this page to add new topics and approve/deny users.
 */
class AdminPage extends React.Component<IProps, IState> {
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
  static parseInput = (input: {
    id: string,
    creationDate: string,
    email: string,
    displayName: string,
    motivation: string
  }[]): ApprovalRequest[] => input.map((value) => ({
    id: value.id,
    creationDate: new Date(value.creationDate),
    email: value.email,
    displayName: value.displayName,
    motivation: value.motivation,
  }));

  constructor(props) {
    super(props);

    // Initial state of the component: empty list
    this.state = { requests: [] };
  }

  /** Call the getUsers function and set the state accordingly */
  async componentDidMount() {
    const { session } = this.props;
    if (session && session.user && session.user.admin) {
      await this.getUsers()
        .then((users: ApprovalRequest[]) => this.setState({ requests: users }));
    }
  }

  /**
   * Get the users from the back-end.
   * @return - When fetch succeeds, return a list of users
   */
  getUsers = async () => {
    let requests: ApprovalRequest[] = [];
    // Use the front-end as a proxy
    await fetch(`${process.env.NEXT_PUBLIC_FE_URL}/api/admin/pending`, {
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => { requests = data; });

    return requests;
  };

  /**
   * Post the approval/denial request to the back-end
   * @param request: The approval request, with the request ID and email
   * @param status - Approved/Denied
   */
  postUserStatus = async (request: ApprovalRequest, status: string) => {
    // The body for the fetch
    const body = {
      requestId: request.id,
      email: request.email,
      status,
    };

    await fetch(`${process.env.NEXT_PUBLIC_FE_URL}/api/admin/approval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (res.ok) {
          // Successful approval/denial. Reload the requests.
          this.getUsers()
            .then((users: ApprovalRequest[]) => this.setState({ requests: users }));
        } else {
          // Approval/Denial failed. Go to the catch statement.
          Promise.reject();
        }
      })
      .catch(() => message.error('Failed to approve/deny user'));
  };

  render() {
    const { requests } = this.state;
    const { session } = this.props;

    if (session && session.user) {
      if (session.user.admin) {
        return (
          <div style={{ margin: '0px 20px' }}>
            <Head>
              <title>Administration | APE</title>
            </Head>
            <div className={styles.section}>
              <Title>Topics</Title>
              <TopicCreate />
            </div>
            <div className={styles.section}>
              <Title>Approvals</Title>
              <Approval approvalRequests={requests} postUserStatus={this.postUserStatus} />
            </div>
          </div>
        );
      }
      return (
        <Result
          status="403"
          title="403 Forbidden"
          subTitle="You have no access to this page."
          extra={<Button type="primary" href="/">Go to home</Button>}
        />
      );
    }

    return (
      <Result
        status="403"
        title="403 Forbidden"
        subTitle="You have to be logged in to access this page."
        extra={<Button type="primary" onClick={() => signIn()}>Go to login</Button>}
      />
    );
  }
}

export async function getServerSideProps({ req }) {
  const session = await getSession({ req });
  return {
    props: {
      session,
    },
  };
}

export default AdminPage;
