/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Space, Layout } from 'antd';
import Sidebar from '@components/Explore/Sidebar/Sidebar';
import WorkflowVisualizer from '@components/Explore/WorkflowVisualizer/WorkflowVisualizer';
import WorkflowData from '@models/workflow/WorkflowVisualizerData';
import styles from '@pages/app.module.scss';

/**
 * Props of the explore component
 */
interface ExploreProps {
  /**
   * List of workflowdata retrieved from ape.
   */
  workflows: WorkflowData[];
}

/**
 * State of explore component
 */
interface ExploreState {
  /**
   * A list with the indices of the selected workflows
   */
  selected: number[];
  /**
   * The workflow currently stated as reference
   */
  referenceWorkflow: WorkflowData,
}

/**
 * The Explore component connects the {@link SideBar} and {@link WorkflowVisualizer} components.
 *
 * When the sidebar trigger `onSelect`,
 * this component updates it state and shows or hides the corresponding WorkflowVisualizer.
 * This component holds the current reference workflow in its state.
 */
class Explore extends React.Component<ExploreProps, ExploreState> {
  constructor(props: ExploreProps) {
    super(props);
    this.state = {
      selected: [],
      referenceWorkflow: undefined,
    };
  }

  /**
   * Resets the reference workflow if it is no longer selected
   */
  resetReference = () => {
    const { workflows } = this.props;
    const { selected, referenceWorkflow } = this.state;
    let mustReset = true;
    selected.forEach((select) => {
      if (workflows[select] === referenceWorkflow) {
        mustReset = false;
      }
    });
    if (mustReset && referenceWorkflow !== undefined) {
      this.setState({ referenceWorkflow: undefined });
    }
  };

  /**
   * @returns a list of the workflow graphs to be rendered.
   */
  renderWorkflows = () => {
    const cards = [];
    const { workflows } = this.props;
    const { selected, referenceWorkflow } = this.state;
    const select = selected.sort();
    for (let i = 0; i < select.length; i += 1) {
      const index = select[i];
      const data = workflows[index];
      const name = `Workflow ${index + 1}`;
      cards.push(
        <div key={name} style={{ width: 'calc(50vw - 170px)' }}>
          <WorkflowVisualizer
            data={data}
            name={name}
            isReference={data === referenceWorkflow}
            referenceWorkflow={referenceWorkflow}
            setReference={this.setReference}
          />
        </div>,
      );
    }
    return cards;
  };

  /**
   * Sets the reference workflow to the given workflow
   * @param referenceWorkflow The workflow that should be reference
   */
  setReference = (referenceWorkflow: WorkflowData) => {
    this.setState({ referenceWorkflow });
  };

  /**
   * Updates the current state with the currently selected sidebar items
   * @param selected A list with the indices of the selected workflows
   */
  onSelect = (selected) => {
    this.setState({ selected });
    this.resetReference();
  };

  render() {
    const { workflows } = this.props;
    return (
      <>
        <Sidebar workflows={workflows} onSelect={this.onSelect} />
        <Layout.Content
          className={styles.Ant}
          style={{
            margin: '0 30px',
            overflowX: 'auto',
          }}
        >
          <Space
            size={20}
          >
            {this.renderWorkflows()}
          </Space>
        </Layout.Content>
      </>
    );
  }
}

export default Explore;
