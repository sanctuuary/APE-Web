/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import styles from './Node.module.less';

/**
 * Workflow output node for the {@link WorkflowVisualizer}
 */
function OutputNode({ data }: any) {
  return (
    <div
      className={styles.OutputNode}
    >
      <Handle
        // Single input handle at the top of the node
        className={styles.Handle}
        id="in"
        type="target"
        position={Position.Top}
        isConnectable={false}
      />
      <div>{data.label}</div>
    </div>
  );
}

export default OutputNode;
