/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';
import DomainVerifier from '@components/Domain/DomainVerifier';
import styles from './edit/[id].module.less';

/**
 * The page for creating domains.
 */
function CreateDomain() {
  const [domainId, setDomainId] = React.useState<string>(null);

  /**
   * Update the domain ID to trigger the verifier after the domain has been created.
   * @param id The ID of the created domain.
   */
  const afterCreate = (id: string) => setDomainId(id);

  return (
    <div className={styles.sideMargins}>
      <Head>
        <title>Create domain | APE</title>
      </Head>
      <DomainCreate callback={afterCreate} />
      <DomainVerifier domainId={domainId} />
    </div>
  );
}

export default CreateDomain;
