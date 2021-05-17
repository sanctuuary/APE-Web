import React from 'react';
import { RunOptions } from '@models/workflow/Workflow';
import { Button, Card, Form, Input, InputNumber, message } from 'antd';
import styles from './RunParametersConfig.module.scss';

/**
 * The props for {@link RunParametersConfig}.
 */
interface RunParametersConfigProps {
  /** The current run parameters configuration. */
  runParameters: RunOptions;
}

/**
 * Component for configuring the global run parameters limits.
 */
export function RunParametersConfig(props: RunParametersConfigProps) {
  const { runParameters } = props;

  /**
   * POST the updated run parameters configuration.
   * @param values The new configuration.
   */
  function postRunParameters(values: RunOptions) {
    const endpoint: string = `${process.env.NEXT_PUBLIC_FE_URL}/api/admin/runparameters/${values.id}`;
    fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
      .then((res) => {
        // Success
        if (res.status === 200) {
          message.success('Updated the run parameters.');
          return;
        }
        // Fail
        message.error('Failed to update the run parameters!');
      });
  }

  return (
    <Card>
      <Form
        className={styles.Form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={runParameters}
        onFinish={postRunParameters}
      >
        <Form.Item
          name="id"
          hidden={true}
        >
          <Input />
        </Form.Item>

        <Form.Item
          className={styles.Label}
          label="Min steps"
          labelAlign="left"
          name="minLength"
        >
          <InputNumber
            className={styles.Input}
          />
        </Form.Item>

        <Form.Item
          className={styles.Label}
          label="Max steps"
          labelAlign="left"
          name="maxLength"
        >
          <InputNumber
            className={styles.Input}
          />
        </Form.Item>

        <Form.Item
          className={styles.Label}
          label="Max duration (s)"
          labelAlign="left"
          name="maxDuration"
        >
          <InputNumber
            className={styles.Input}
          />
        </Form.Item>

        <Form.Item
          className={styles.Label}
          label="Number of solutions"
          labelAlign="left"
          name="solutions"
        >
          <InputNumber
            className={styles.Input}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>
      </Form>
    </Card>
  );
}

export default RunParametersConfig;
