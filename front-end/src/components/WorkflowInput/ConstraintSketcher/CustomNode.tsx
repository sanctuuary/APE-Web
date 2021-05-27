/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Handle, Position } from 'react-flow-renderer';
import { Ontology, Tool } from '@models/workflow/Workflow';
import { Row, Col, Button } from 'antd';
import ToolSelector from '@components/WorkflowInput/ToolSelector';
import styles from './ConstraintSketcher.module.less';

/** Props interface for {@link CustomNode} */
interface CustomNodeProps {
  /** The id of the node */
  id: string;
  /** Data storage for all extra functionality */
  data: {
    /** The tool ontology for the OntologyTreeSelect */
    toolOntology: Ontology,
    /** The value of the node */
    tool: Tool,
    /** The onChange function for the OntologyTreeSelect */
    onChange: (id: string, value: Tool) => void;
    /** The onRemove function for the node */
    onRemove: (id: string) => void;
  };
}

/**
 * A custom node component for {@link ConstraintSketcher}. It has a
 * {@link ToolSelector} for the node value.
 */
function CustomNode(props: CustomNodeProps) {
  const { id, data } = props;

  return (
    <div className={styles.CustomNode} id={id}>
      <Handle type="target" position={Position.Top} style={{ borderRadius: 0 }} />
      <Row>
        <Col span={20}>
          <ToolSelector
            toolOntology={data.toolOntology}
            tool={data.tool}
            onChange={(value: Tool) => data.onChange(id, value)}
          />
        </Col>
        <Col span={4}>
          <Button onClick={() => data.onRemove(id)}>
            x
          </Button>
        </Col>
      </Row>
      <Handle type="source" position={Position.Bottom} style={{ borderRadius: 0 }} />
    </div>
  );
}

export default CustomNode;
