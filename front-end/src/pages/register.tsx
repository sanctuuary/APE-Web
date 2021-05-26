/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import RegisterForm from '@components/Login/RegisterForm';
import { Col, Row } from 'antd';
import styles from './Register.module.less';

/**
 * The page where users can register an account.
 */
function RegisterPage() {
  return (
    <div>
      <Head>
        <title>Register | APE</title>
      </Head>
      <Row justify="center" align="middle" className={styles['height-offset']}>
        <Col>
          <RegisterForm />
        </Col>
      </Row>
    </div>
  );
}

export default RegisterPage;
