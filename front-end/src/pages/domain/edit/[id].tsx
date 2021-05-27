/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Button, Result } from 'antd';
import DomainEdit from '@components/Domain/DomainEdit/DomainEdit';
import Domain, { Topic } from '@models/Domain';
import { getSession } from 'next-auth/client';
import { fetchTopics } from '@components/Domain/Domain';
import styles from './[id].module.less';

/**
 * Props for DomainEditPage
 */
interface IDomainEditPageProps {
  /** The ID of the domain to edit */
  domain: Domain;
  topics: Topic[];
  notFound: boolean;
  access: boolean;
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
 * Page for editing domains, built around the {@link DomainEdit} component.
 *
 * Includes result pages to be shown in case of erorrs.
 */
function DomainEditPage({ domain, topics, notFound, access }: IDomainEditPageProps) {
  const router = useRouter();

  return (
    <div className={styles.sideMargins}>
      { /*
         * Make sure DomainEdit is not rendered before data is loaded.
         * Otherwise, Ant Desing's Form initialValues does not work.
         */
        domain !== null && topics !== [] && access && (
          <div>
            <Head>
              <title>Edit {domain.title} | APE</title>
            </Head>
            <DomainEdit
              domain={domain}
              topics={topics}
              router={router}
            />
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
        // Show unauthorized result when the user doesn not have access
        !access && (
          <Result
            status="403"
            title="403"
            subTitle="Sorry, you do not have access to edit this domain."
            extra={<Button type="primary" href="/domain">Return to my domains</Button>}
          />
        )
      }
    </div>
  );
}

export async function getServerSideProps({ query, req }) {
  // Get the domainID fromt the url parameters
  const session = await getSession({ req });
  let access;
  let notFound = false;
  let domain = null;
  let topics = [];
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
  }
  return {
    props: { access, notFound, domain, topics },
  };
}

export default DomainEditPage;
