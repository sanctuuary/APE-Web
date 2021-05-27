/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';
import styles from './edit/[id].module.less';

/**
 * The page for creating domains, built around the {@link DomainCreate} component.
 */
function CreateDomain() {
  return (
    <div className={styles.sideMargins}>
      <Head>
        <title>Create domain | APE</title>
      </Head>
      <DomainCreate />
    </div>
  );
}

export default CreateDomain;
