/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Checkbox } from 'antd';
import WorkflowData from '@models/workflow/WorkflowVisualizerData';
import styles from './Sidebar.module.less';

/**
 * Props of the SidebarItem component.
 */
interface SidebarItemProps {
  /**
   * Index of the sidebaritem in the sidebar
   */
  index: number,
  /**
   * Workflow that belongs to the item.
   */
  workflow: WorkflowData;
}

/**
 * A single workflow representation in the {@link Sidebar}.
 *
 * Contains the name of the workflow, information on the used tools, and a select button.
 */
function SidebarItem(props: SidebarItemProps) {
  const { index, workflow } = props;

  /**
   * Get the number of nodes inside a workflow tree
   * It calculates each amount of input/output types.
   * @param nodes list of tools in the workflow.
   * @returns sum of number of nodes in each subtree
   */
  const workflowNodes = (nodes) => nodes
    .map((tool) => tool.inputTypes.length + tool.outputTypes.length)
    .reduce((x, y) => x + y, 0);

  /**
   * Make a string of all tool names, so it can be displayed in the sidebar item.
   * @param tools list of all workflow tools.
   * @returns a string split by commas of every tool used in the subtree.
   */
  const workflowTools = (tools) => tools.map((tool, i) => <li key={`${tool.label}${i.toString()}`}>{tool.label}</li>);

  /**
   * Collect all data for the workflow summary
   * @returns an object with the height, size and tools.
   */
  const workflowSummary = () => {
    const height = workflow.tools.length;
    const size = workflowNodes(workflow.tools) + 2 + workflow.outputTypeStates.length;
    const tools = workflowTools(workflow.tools);
    return { height, size, tools };
  };

  const { height, size, tools } = workflowSummary();
  const name = `Workflow ${index + 1}`;
  const style = styles['Sidebar-item-prop'];
  return (
    <Checkbox
      className={styles['Sidebar-item']}
      value={index}
    >
      {name}
      <span className={styles['Sidebar-item-summary']}>
        <p className={style}>Nodes: {size}; Tools: {height}</p>
        <ul className={style}>{tools}</ul>
      </span>
    </Checkbox>
  );
}

export default SidebarItem;
