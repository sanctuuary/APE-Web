/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Button, Typography } from 'antd';
import DomainList from '@components/Domain/DomainList/DomainList';
import Domain from '@models/Domain';
import { getSession } from 'next-auth/client';
import styles from './index.module.scss';

const { Title, Paragraph } = Typography;

/**
 * Props for {@link DomainsPage}.
 */
interface IDomainsPageProps {
  /** Public domains available to all users. */
  publicDomains: Domain[],
  /** Domains owned by the current user (when user is logged in). */
  ownedDomains: Domain[],
  /** Domains shared with the current user (when user is logged in). */
  sharedDomains: Domain[],
  /** Current user's session. */
  session: any,
}

/**
 * Page showing all domains related to the current user.
 * Users can be logged out, unapproved, or approved.
 *
 * This is currently the home page of the website.
 */
function DomainsPage({ publicDomains, ownedDomains, sharedDomains, session }: IDomainsPageProps) {
  /**
   * Show all domains owned by the user.
   */
  const renderUserDomains = () => {
    if (session && session.user && session.user.status === 'Approved') {
      return (
        <div className={styles.userDomains}>
          <Title>My domains</Title>
          <Button type="primary" className={styles.addButton} href="/domain/new">Add domain</Button>
          <DomainList domains={ownedDomains} showVisibility={true} edit={true} />
        </div>
      );
    }
    return null;
  };

  /**
   * Show all domains shared with the logged in user.
   */
  const renderSharedDomains = () => {
    if (session && session.user && session.user.status === 'Approved' && sharedDomains.length !== 0) {
      return (
        <div className={styles.userDomains}>
          <Title>Shared with me</Title>
          <DomainList domains={sharedDomains} showVisibility={true} showAccess={true} edit={true} />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.pageSideMargins}>
      <Head>
        <title>Home | APE</title>
      </Head>
      <div>
        <Title>Welcome to APE Web View</Title>
        <Paragraph>&nbsp;</Paragraph>
        <Paragraph>
          APE (Automated Pipeline Explorer) Web View is a graphical interface for the&nbsp;
          <strong>APE library</strong>&nbsp;
          (see <a href="https://github.com/sanctuuary/APE/" target="_blank" rel="noreferrer noopener">GitHub</a>),
          used for the automated exploration of possible computational pipelines
          (scientific workflows) from large collections of computational tools.
        </Paragraph>
        <Paragraph>
          APE relies on a semantic domain model that includes tool and type taxonomies
          as controlled vocabularies for the description of computational tools,
          and functional tool annotations (inputs, outputs, operations performed)
          using terms from these taxonomies.
          Based on this domain model and a specification of the available workflow inputs,
          the intended workflow outputs and possibly additional constraints,
          APE then computes possible workflows. For detailed documentation please visit&nbsp;
          <a href="https://ape-framework.readthedocs.io/en/latest/" target="_blank" rel="noreferrer noopener">our page</a>.
        </Paragraph>
        <Paragraph>
          APE Web View allows you to explore and automatically compose
          these workflows from pre-defined domains
          (such as image manipulation domain using the ImageMagick toolset).
          In addition you are encouraged to create your own domains and share them with other users.
        </Paragraph>
        <Paragraph>
          For our paper at&nbsp;
          <a href="https://doi.org/10.1007/978-3-030-50436-6_34" rel="nofollow">ICCS 2020</a>&nbsp;
          we created a <a href="https://www.youtube.com/watch?v=CzecqRJXmoM">video</a>&nbsp;
          that explains APE in 5 minutes.
        </Paragraph>
      </div>
      <Title>Public domains</Title>
      <DomainList domains={publicDomains} edit={false} />
      {renderUserDomains()}
      {renderSharedDomains()}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  // Get all domains related to the current user
  const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/domain/`;
  let publicDomains: Domain[] = [];
  // Fetch all publicly available domains
  await fetch(endpoint, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      publicDomains = data;
    });

  let ownedDomains: Domain[] = [];
  let sharedDomains: Domain[] = [];
  const session: any = await getSession({ req });
  if (session && session.user) {
    const { user } = session;
    const ownerParams = new URLSearchParams({ userId: user.userId });
    ownerParams.append('accessRights', ['Owner'].join());
    // Fetch domains owned by the current user
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/with-user-access?${ownerParams}`,
      {
        credentials: 'include',
        headers: {
          cookie: session.user.sessionid,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return [];
      })
      .then((domains) => {
        ownedDomains = domains;
      });
    const sharedParams = new URLSearchParams({ userId: user.userId });
    sharedParams.append('accessRights', ['ReadWrite', 'Read'].join());
    // Fetch domains shared with the current user
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL_NODE}/api/domain/with-user-access?${sharedParams}`,
      {
        credentials: 'include',
        headers: {
          cookie: session.user.sessionid,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        }
        return [];
      })
      .then((domains) => {
        sharedDomains = domains;
      });
  }

  return {
    props: { publicDomains, ownedDomains, sharedDomains, session },
  };
}

export default DomainsPage;
