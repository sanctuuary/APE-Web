/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Form, Input, Button, Row, Col, Result, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Login.module.less';
import passwordRules from './DefaultRules';

/**
 * Form for registering a new user.
 *
 * Defines the {@link RegisterPage}.
 */
function RegisterForm() {
  const [showSuccess, setShowSuccess] = React.useState(false);

  /**
   * Send the form data to the back-end.
   * @param values The form values
   */
  const handleSubmit = async (values) => {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/user/register`;
    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username: values.username,
        password: values.password,
        displayName: values.displayName,
        motivation: values.motivation,
      }),
    })
      .then((response) => response)
      .then(async (data: any) => {
        switch (data.status) {
          case 201: {
            setShowSuccess(true);
            break;
          }
          case 409: {
            message.warning('This email address is already in use!');
            break;
          }
          case 400: {
            message.warning('This email address is not valid!');
            break;
          }
          default: {
            message.error('An error occured trying to register an account.');
            break;
          }
        }
      });
  };

  /**
   * The elements for the form.
   *
   * This form is shown at first.
   */
  const FormElements = () => (
    <Row>
      <Col className={styles['Login-container']}>
        <h1 className={styles['Login-title']}>Request access</h1>
        <Form
          name="register"
          onFinish={handleSubmit}
          className={styles['Login-form']}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Enter a valid email' }]}
            className={styles['Register-item']}
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
            rules={passwordRules}
            hasFeedback
            className={styles['Register-item']}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            dependencies={['password']}
            rules={passwordRules.concat(
              // Check if passwords match
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            )}
            hasFeedback
            className={styles['Register-item']}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm password"
            />
          </Form.Item>
          <br />
          <br />
          <Form.Item
            name="displayName"
            rules={[{ required: true, message: 'Enter your display name' }]}
            className={styles['Register-item']}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Display name"
              type="text"
            />
          </Form.Item>
          <Form.Item
            name="motivation"
            rules={[{
              required: true,
              message: 'Please give a motivation for your access request',
            }]}
            className={styles['Register-item']}
          >
            <Input.TextArea
              placeholder="Motivation"
            />
          </Form.Item>
          <p>Your account will be created and await approval by an administrator.<br />
            Until an administrator has approved your request, you will have limited access.
          </p>
          <Form.Item className={styles['Register-item']}>
            <Button
              type="primary"
              htmlType="submit"
              className={styles['Register-submit']}
            >
              Submit request
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );

  /**
   * The elements for the result after the form has been submitted successfully.
   *
   * The form will be replaced by this result element.
   */
  const SuccessResult = () => (
    <Result
      status="success"
      title="Your request for a user account has been received"
      subTitle="An administrator will look at your request soon. For now, you can use your account with limited access."
      extra={(
        <Button type="primary" href="/">
          Back to the home page
        </Button>
      )}
    />
  );

  return (
    <div>
      { /* Render the form at first */ }
      { showSuccess ? null : <FormElements /> }
      { /* After the form has been successfuly submitted, show the result */ }
      { showSuccess ? <SuccessResult /> : null }
    </div>
  );
}

export default RegisterForm;
