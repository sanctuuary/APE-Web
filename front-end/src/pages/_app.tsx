/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import 'antd/dist/antd.less';
import '../styles/globals.less';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import Header from '@components/Header/Header';
import Footer from '@components/Footer/Footer';
import { Provider } from 'next-auth/client';
import { Layout } from 'antd';
import styles from './app.module.less';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout className={styles.Ant}>
      <Provider>
        <Header />
        <Layout className={styles.Ant} style={{ marginTop: 84, minHeight: '100vh', marginBottom: 20 }}>
          <Component {...pageProps} />
        </Layout>
        <Footer />
      </Provider>
    </Layout>
  );
}

export default MyApp;
