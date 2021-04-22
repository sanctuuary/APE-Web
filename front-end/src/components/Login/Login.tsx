/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form, Input, Button, Row, Col, message } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { signIn, useSession } from 'next-auth/client';
import styles from './Login.module.scss';

/**
 * Form for loging in.
 *
 * Defines the {@LoginPage}.
 */
function Login() {
  const router = useRouter();

  /**
   * Check whether the callbackUrl is on the same host
   * prevents redirecting to malicious websites
   * @param url callback url to check
   * @param base base url
   */
  const redirect = (url, base) => (
    url && url.startsWith(base) && url !== `${base}${router.pathname}`
      ? url
      : base
  );

  let callbackUrl = '/';
  const [session] = useSession();
  /*
   * When the user presses the login button
   * it sends a post request with the filled in values.
   */
  const handleSubmit = (values) => {
    signIn('credentials', { ...values, callbackUrl });
  };

  // If the user is logged in send him back to the homepage
  if (session && session.user) {
    router.push(callbackUrl);
  }

  // ComponentDidUpdate, if user entered wrong credentials, show this on screen.
  useEffect(() => {
    if (router.query) {
      if (router.query.error === 'CredentialsSignin') {
        message.error('Incorrect username and/or password.');
        router.query.error = undefined;
      }
    }
    const base = `${window.location.protocol}//${window.location.host}/`;
    callbackUrl = redirect(router.query.callbackUrl, base);
  }, [router]);

  return (
    <Row className={styles.Login} justify="center" align="middle">
      <Col className={styles['Login-container']}>
        <h1 className={styles['Login-title']}>Login</h1>
        <Form onFinish={handleSubmit} className={styles['Login-form']} action="/api/auth/">
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Enter a valid email' }]}
            className={styles['Login-item']}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              type="email"
              autoComplete="email"
            />
          </Form.Item>
          <Form.Item
            name="password"
            className={styles['Login-item']}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              type="password"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item className={styles['Login-item']}>
            <Button
              className={styles['Login-submit']}
              type="primary"
              htmlType="submit"
            >
              Login
            </Button>
            No account? <a href="/register">Request account</a>
            <a href="/password/forgot" className={styles['Login-forgot']}>
              Forgot password?
            </a>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
