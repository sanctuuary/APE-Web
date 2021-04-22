/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import Login from '@components/Login/Login';

/**
 * The page where users log in.
 */
function LoginPage() {
  return (
    <div>
      <Head>
        <title>Login | APE</title>
      </Head>
      <Login />
    </div>
  );
}

export default LoginPage;
