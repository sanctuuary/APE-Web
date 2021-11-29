/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { NextRouter, useRouter } from 'next/router';
import { Button, message, Popconfirm, Result, Typography } from 'antd';
import DomainEdit from '@components/Domain/DomainEdit/DomainEdit';
import Domain, { Topic, UserWithAccess } from '@models/Domain';
import { getSession } from 'next-auth/client';
import { fetchTopics } from '@components/Domain/Domain';
import AccessManager from '@components/Domain/AccessManager/AccessManager';
import styles from './[id].module.less';

const { Title } = Typography;

/**
 * Props for DomainEditPage
 */
interface IDomainEditPageProps {
  /** The ID of the current user. */
  userId: string,
  /** The ID of the domain to edit */
  domain: Domain;
  /** The topics of the domain. */
  topics: Topic[];
  /** Whether the domain was found. */
  notFound: boolean;
  /** Whether the user has access to the domain. */
  access: boolean;
  /** Whether the user is the owner of the domain. */
  isOwner: boolean;
}

/**
 * Check if a certain user has Owner or ReadWrite access to a certain domain
 * @param user The user who's access should be checked
 * @param domainID The domain to check the access of
 */
async function hasAccess(user, domainID: string): Promise<boolean> {
  // Check if the user has the proper access level
  const params = new URLSearchParams({ userId: user.userId });
  params.append('accessRights', ['Owner', 'ReadWrite'].join());
  const endpoint: string = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/with-user-access?${params}`;
  const access: boolean = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { cookie: user.sessionid },
  })
    .then((res) => {
      // If the user has no access, leave the page
      if (res.status === 403) {
        return false;
      }
      return res.json();
    })
    .then((data: Array<Domain>) => {
      if (!data) {
        return false;
      }
      return data.some((domain: Domain) => domain.id === domainID);
    });
  return access;
}

/**
 * Check whether a user is the owner of a domain.
 * @param user The user who we check to be the owner.
 * @param domainId The domain to check ownership of.
 * @returns True if the user is the owner, false if the user is not the owner.
 */
async function checkOwnership(user, domainId: string): Promise<boolean> {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/users-with-access/${domainId}?accessRights=Owner`;
  return fetch(endpoint, {
    method: 'GET',
    headers: {
      cookie: user.sessionid,
    },
  })
    .then((response) => response.json())
    .then((data: UserWithAccess[]) => {
      let owner = false;
      data.forEach((u: UserWithAccess) => {
        if (u.userId === user.userId) {
          owner = true;
        }
      });
      return owner;
    })
    .catch(() => false);
}

/**
 * Fetch a domain from the back-end.
 * @param user The user information, with the sessionid.
 * @param id The ID of the domain to fetch
 */
async function fetchDomain(user: any, id: string): Promise<Domain | null> {
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/domain/${id}/`;
  const response = await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { cookie: user.sessionid },
  })
    .then((res) => {
      // Domain could not be found
      if (res.status === 500 || res.status === 400) {
        return null;
      }
      return res.json();
    });
  return response;
}

/**
 * Delete a domain. Note: no questions are asked, this will delete the domain!
 * @param domain The domain to delete.
 * @param router The router, used to redirect the user back to the homepage.
 */
async function deleteDomain(domain: Domain, router: NextRouter) {
  const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/delete/${domain.id}`;
  await fetch(endpoint, {
    method: 'POST',
    credentials: 'include',
  })
    .then((res) => {
      if (res.status !== 200) {
        message.error(`Failed to delete domain: ${res.statusText}`);
        return;
      }
      message.info(`Domain "${domain.title}" removed`);
      router.push('/');
    });
}

/**
 * Page for editing domains, built around the {@link DomainEdit} component.
 *
 * Includes result pages to be shown in case of errors.
 */
function DomainEditPage(props: IDomainEditPageProps) {
  const router = useRouter();
  const { userId, domain, topics, notFound, access, isOwner: isOwnerInitial } = props;
  const [isOwner, setIsOwner] = React.useState<boolean>(isOwnerInitial);

  return (
    <div className={styles.sideMargins}>
      { /*
         * Make sure DomainEdit is not rendered before data is loaded.
         * Otherwise, Ant Design's Form initialValues does not work.
         */
        domain !== null && topics !== [] && access && (
          <div>
            <Head>
              <title>Edit {domain.title} | APE</title>
            </Head>
            <Title level={2}>Domain</Title>
            <DomainEdit
              domain={domain}
              topics={topics}
              router={router}
            />
            {
              isOwner && (
                <div>
                  <div>
                    <Title level={2}>Permissions</Title>
                    <AccessManager
                      domain={domain}
                      onOwnershipTransferred={(newOwner) => setIsOwner(newOwner.userId === userId)}
                    />
                  </div>
                  <div>
                    <Title level={2}>Other</Title>
                    <Popconfirm
                      title={(
                        <div>
                          <div>You are about to delete the domain &quot;{domain.title}&quot;.</div>
                          <div>
                            This is permanent and <strong>cannot be undone</strong>.
                            Are you sure?
                          </div>
                        </div>
                      )}
                      onConfirm={() => deleteDomain(domain, router)}
                      placement="topRight"
                    >
                      <Button danger>Delete domain</Button>
                    </Popconfirm>
                  </div>
                </div>
              )
            }
          </div>
        )
      }
      {
        // Show a not found result when the domain could not be found
        notFound && (
          <Result
            status="error"
            title="Domain not found"
            subTitle="The given domain could not be found."
            extra={[
              <Button type="primary" href="/domain" key="back">
                Go back
              </Button>,
            ]}
          />
        )
      }
      {
        // Show unauthorized result when the user doesn't not have access
        !access && (
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you do not have access to edit this domain."
            extra={<Button type="primary" href="/">Return to the home page</Button>}
          />
        )
      }
    </div>
  );
}

export async function getServerSideProps({ query, req }) {
  // Get the domainID from the url parameters
  const session = await getSession({ req });
  let access: boolean = false;
  let owner: boolean = false;
  let notFound = false;
  let domain = null;
  let topics = [];

  if (session !== null) {
    await hasAccess(session.user, query.id).then((acc) => { access = acc; });
    if (access) {
      await fetchDomain(session.user, query.id)
        .then((d) => {
          // Domain not found, update state
          if (d === null) {
            notFound = true;
            return;
          }
          domain = d;
        });
      // Get all topics
      await fetchTopics(session.user, true)
        .then((t) => { topics = t; });
      await checkOwnership(session.user, query.id)
        .then((o) => { owner = o; });
    }
  }
  return {
    props: { access, isOwner: owner, notFound, domain, topics },
  };
}

export default DomainEditPage;
