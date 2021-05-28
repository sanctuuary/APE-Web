/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Button, Col, Row } from 'antd';
import React from 'react';
import SketchTranslation from '@components/WorkflowInput/ConstraintSketcher/SketchTranslation';
import { Sketch } from '@components/WorkflowInput/ConstraintSketcher/ConstraintSketcher';
import styles from './ConstraintSketcher.module.less';

/** Props interface for {@link Sidebar} */
interface SidebarProps {
  /** The current sketch to display */
  sketch: Sketch;
  /** The onSubmit function. Possible to pass constraints to {@link WorkflowInput} */
  onSubmit: (save: boolean) => void;
}

/**
 * Sidebar component for the {@link ConstraintSketcher}. Contains the {@link SketchTranslation}
 * of the current sketch, as well buttons to confirm and cancel the sketch.
 */
function Sidebar(props: SidebarProps) {
  const { sketch, onSubmit } = props;

  /**
   * Translate the current sketch into actual constraints and submit them.
   */
  const onConfirm = () => {
    onSubmit(true);
  };

  /**
   * Close the current sketch without saving it.
   */
  const onCancel = () => {
    onSubmit(false);
  };

  return (
    <div>
      <Row>
        <Col span={12} style={{ paddingRight: '1px' }}>
          <Button
            id={styles.Button}
            className={styles.Confirm}
            block
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </Col>
        <Col span={12} style={{ paddingLeft: '1px' }}>
          <Button
            id={styles.Button}
            className={styles.Cancel}
            block
            onClick={onCancel}
          >
            Cancel
          </Button>
        </Col>
      </Row>
      <Row>
        <p>Preview added rules</p>
      </Row>
      <Row>
        <SketchTranslation
          sketch={sketch}
        />
      </Row>
    </div>
  );
}

export default Sidebar;
