/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { getSession } from 'next-auth/client';
import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head';
import { Button, message, Result } from 'antd';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';
import DomainVerifier from '@components/Domain/DomainVerifier';
import { fetchTopics } from '@components/Domain/Domain';
import { Topic } from '@models/Domain';
import styles from './edit/[id].module.less';

/**
 * Props for the {@link CreateDomain} page.
 */
interface CreateDomainPageProps {
  /** The available topics. */
  topics: Topic[],
}

/**
 * The page for creating domains.
 */
function CreateDomain(props: CreateDomainPageProps) {
  const [domainId, setDomainId] = React.useState<string>(null);
  const router: NextRouter = useRouter();
  const { topics } = props;

  /**
   * Update the domain ID to trigger the verifier after the domain has been created.
   * @param id The ID of the created domain.
   */
  const afterCreate = (id: string) => {
    message.success('Domain successfully created');
    setDomainId(id);
  };

  /** Domain creation cancelled, go back to home page. */
  const onCancel = () => router.push('/');

  /**
   * Page shown when the user is not logged in.
   */
  const ForbiddenResult = () => (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle="You must be logged in to access this page."
      extra={<Button type="primary" href="/login">Go to login</Button>}
    />
  );

  /**
   * Page shown when the user is logged in.
   */
  const CreateDomainComponent = () => (
    <div className={styles.sideMargins}>
      <DomainCreate topics={topics} callbackCreated={afterCreate} callbackCancelled={onCancel} />
      <DomainVerifier domainId={domainId} />
    </div>
  );

  return (
    <div>
      <Head>
        <title>Create domain | APE</title>
      </Head>
      {topics === null ? <ForbiddenResult /> : <CreateDomainComponent />}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session: any = await getSession({ req });

  if (session === null) {
    return {
      props: { topics: null },
    };
  }

  const topics: Topic[] = await fetchTopics(session.user, true);

  return {
    props: { topics },
  };
}

export default CreateDomain;
