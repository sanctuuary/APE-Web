/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { testTools, listedTestTools } from '@tests/data/WorkflowInput';
import { OntologyNode, Tool } from '@models/workflow/Workflow';

interface MockProps {
  /** The current tool selected */
  tool: Tool;
  /** The onChange function to call back a value change */
  onChange: (value: Tool) => void;
}

const ToolSelector = (props: MockProps) => {
  const { tool, onChange } = props;

  const options = [];

  const root = testTools.roots[0];

  const fold = (node: OntologyNode, parents: string[] = []) => {
    const concat = parents.concat(node.label);
    const joinedString = concat.join('/');
    options.push(<option value={node.id} key={joinedString}>{node.label}</option>);

    if (node.children) {
      node.children.forEach((child) => fold(child, concat));
    }
  };

  fold(root);

  return (
    <select
      value={tool.label || ''}
      onChange={(e) => {
        onChange(listedTestTools.find(({ id }) => id === e.target.value));
      }}
    >
      { options }
    </select>
  );
};

export default ToolSelector;
