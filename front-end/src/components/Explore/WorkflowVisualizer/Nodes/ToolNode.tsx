/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Node.module.scss';

/**
 * Node representing workflow tools for the {@link WorkflowVisualizer}.
 */
function ToolNode({ data }: any) {
  const className = data.extra ? styles.Extra : styles.Regular;

  return (
    <div
      className={className}
    >
      <Handle
        // Single input handle at the top of the node
        id="in"
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <Handle
        // Single output handle at the bottom of the node
        id="out"
        type="source"
        position={Position.Bottom}
        isConnectable={false}
      />
      <div>{data.label}</div>
    </div>
  );
}

export default ToolNode;
