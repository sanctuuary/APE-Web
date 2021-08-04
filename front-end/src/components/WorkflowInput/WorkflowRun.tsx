/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { RefObject } from 'react';
import { Button, Card, Form, InputNumber, Divider } from 'antd';
import { FormInstance } from 'antd/lib/form';
import styles from '@components/Explore/Box.module.less';
import { RunOptions } from '@models/workflow/Workflow';
import TooltipIcon from '@components/TooltipIcon/TooltipIcon';
import Styles from './WorkflowRun.module.less';

/** Properties of the WorkflowRun component */
interface WorkflowRunProps {
  /** Function to call when pressing run */
  onRun: (runOptions: RunOptions) => Promise<void>;
  /** The run options in the input fields */
  runOptions: RunOptions;
  /** The formRef object to allow updates */
  formRef: RefObject<FormInstance>;
  /** Function to manually update run options */
  updateRunOptions: (runOptions: RunOptions) => void;
  /** The run parameters limits */
  runParametersLimits: RunOptions;
}

/** State of the WorkflowRun component */
interface WorkflowRunState {
  /** Whether we're waiting for a response from he back-end after pressing run */
  loading: boolean;
}

/**
 * Component for setting the APE run parameters and running APE.
 *
 * When the run button is pressed, the onRun event bubbles up to the parent component.
 * The parent component should handle further actions.
 */
class WorkflowRun extends React.Component<WorkflowRunProps, WorkflowRunState> {
  constructor(props: WorkflowRunProps) {
    super(props);

    // Set initial state of component
    this.state = {
      loading: false,
    };
  }

  /**
   * Get called when run is pressed.
   *
   * Calls onRun prop to trigger parent element.
   * Sets state to loading until parent is done processing onRun.
   */
  onRun = () => {
    const { onRun, runOptions } = this.props;
    this.setState({ loading: true });
    onRun(runOptions).then(() => this.setState({ loading: false }));
  };

  /**
   * Update the state when a run option field's value is changed.
   * @param changed The changed field with value
   */
  onChange = (changed: RunOptions) => {
    const { updateRunOptions } = this.props;
    updateRunOptions(changed);
  };

  render() {
    const { loading } = this.state;
    const { runOptions: options, formRef, runParametersLimits } = this.props;
    return (
      <div className={styles.Box} id="Run">
        <Card
          title="Run Parameters"
          style={{ minWidth: 350, width: '100%' }}
          headStyle={{ background: '#F1634C' }}
          extra={(
            <TooltipIcon
              content={(
                <ul style={{ marginBottom: 0 }}>
                  {
                    /*
                     * Only one character over the limit,
                     * keeping the <li> compact is preferable over splitting the line.
                     */
                  }
                  <li>Min steps: The minimum number of tools of a workflow.</li>
                  <li>Max steps: The maximum number of tools of a workflow.</li>
                  {/* eslint-disable-next-line max-len */}
                  <li>Max duration: the maximum time (in seconds) spent on generating workflows.</li>
                  <li>Number of solutions: the number of workflows to generate.</li>
                </ul>
              )}
            />
          )}
        >
          <Form
            onFinish={this.onRun}
            onValuesChange={this.onChange}
            initialValues={options}
            ref={formRef}
            name="control-ref"
          >
            <Form.Item name="minLength" label="Min steps" className={Styles.Label}>
              <InputNumber
                id="minLength"
                min={0}
                max={runParametersLimits.minLength}
                className={Styles.Input}
              />
            </Form.Item>

            <Form.Item name="maxLength" label="Max steps" className={Styles.Label}>
              <InputNumber
                id="maxLength"
                min={0}
                max={runParametersLimits.maxLength}
                className={Styles.Input}
              />
            </Form.Item>

            <Form.Item name="maxDuration" label="Max duration (s)" className={Styles.Label}>
              <InputNumber
                id="maxDuration"
                min={0}
                max={runParametersLimits.maxDuration}
                className={Styles.Input}
              />
            </Form.Item>

            <Form.Item name="solutions" label="Number of solutions" className={Styles.Label} labelAlign="right">
              <InputNumber
                id="solutions"
                min={0}
                max={runParametersLimits.solutions}
                className={Styles.Input}
              />
            </Form.Item>
            <Divider />
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              id="submit"
              loading={loading}
              block
              className={Styles.RunButton}
            >
              Run
            </Button>
          </Form>
        </Card>
      </div>
    );
  }
}

export default WorkflowRun;
