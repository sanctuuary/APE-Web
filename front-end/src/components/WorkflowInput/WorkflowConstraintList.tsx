/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React, { useState } from 'react';
import WorkflowConstraint from '@components/WorkflowInput/WorkflowConstraint';
import { Button, Checkbox, Col, Divider, Popconfirm, Row, Space, Typography } from 'antd';
import { ConstraintType, Tool, Constraint, Data, Ontology } from '@models/workflow/Workflow';
import SketchTranslation from '@components/WorkflowInput/ConstraintSketcher/SketchTranslation';
import { Sketch } from '@components/WorkflowInput/ConstraintSketcher/ConstraintSketcher';

const { Text } = Typography;

/**
 * The props for the {@link WorkflowConstraintList} component
 */
interface WorkflowConstraintListProps {
  /** List of constraints */
  constraints: Constraint[];

  /** The data ontology */
  dataOntology: Ontology;

  /** The tool ontology */
  toolOntology: Ontology;

  /** List of constraint options */
  constraintOptions: ConstraintType[];
  /**
   * OnChange function for constraints
   * @param index - the index of the constraint in the constraint list
   * @param constraint - the constraint that should replace it
   */
  onChange: (index: number, constraint: Constraint) => void;
  /** OnAdd function for the add constraint button */
  onAdd: () => void;
  /** Open the sketcher with a given constraint */
  openSketcher: (save: boolean, index?: number) => void;

  deleteSketch: (index: number) => void;
  /**
   * OnRemove function to delete a constraint
   * @param index - the index of the constraint in the constraint list
   */
  onRemove: (index: number) => void;

  /** List of sketches */
  sketches: Sketch[];
  /** Changes in the current sketch */
  sketchChanges: boolean;
  /** Sketch index */
  sketchIndex: number;

  /** Default Constraint */
  defaultData: () => Data;
  defaultTool: () => Tool;
  defaultConstraint: () => Constraint;

  /** Function to clear all constraints. */
  clearConstraints: () => void;

  /** Callback function for when an SLTLx formula is being added. */
  onFormulaAdd: () => void;
  formulas: string[];
  formulaIndex: number;
  deleteFormula: (index: number) => void;
}

/** The ids of the shortlist constraints */
const constraintFilter = [
  'use_t',
  'nuse_t',
  'use_m',
  'nuse_m',
  'ite_m',
  'itn_m',
  'depend_m',
  'next_m',
];

/**
 * Inputs for defining the constraints for APE.
 *
 * Includes constraint dropdowns and a list of constraint sketches.
 */
function WorkflowConstraintList(props: WorkflowConstraintListProps) {
  const {
    constraints,
    dataOntology,
    toolOntology,
    constraintOptions,
    onChange,
    onAdd,
    onRemove,
    openSketcher,
    deleteSketch,
    sketches,
    sketchChanges,
    sketchIndex,
    defaultData,
    defaultTool,
    defaultConstraint,
    clearConstraints,
    onFormulaAdd,
    formulas,
    formulaIndex,
    deleteFormula,
  } = props;

  /*
   * Function to filter the list of constraint options to a shortlist.
   * It's a function, because the constraintOptions is undefined on
   * the first render.
   */
  const filteredList = () => constraintFilter.map((id) => (
    constraintOptions.find((option) => option.id === id)));

  // Hook for the checkbox
  const [showAdvancedConstraints, setShowAdvancedConstraints] = useState(false);

  const workflowConstraintList = constraints.map(
    (constraint: Constraint, index: number) => (
      <WorkflowConstraint
        key={index.toString()}
        dataOntology={dataOntology}
        toolOntology={toolOntology}
        constraintOptions={showAdvancedConstraints ? constraintOptions : filteredList()}
        constraint={constraint}
        index={index}
        onChange={onChange}
        onRemove={onRemove}
        defaultData={defaultData}
        defaultTool={defaultTool}
        defaultConstraint={defaultConstraint}
      />
    ),
  );

  // Hooks for the Popconfirm of the
  const [popIndex, setPopIndex]: [number, (index: number) => void] = useState(-1);

  // The list of sketches, with an edit button, remove button and translation
  const sketchList = sketches.map((sketch: Sketch, index: number) => {
    /** Disable the popIndex, save the currentSketch and open the sketch */
    const onSave = () => {
      setPopIndex(-1);
      openSketcher(true, index);
    };

    /** Disable the popIndex, don't save the currentSketch and open the sketch */
    const onDiscard = () => {
      setPopIndex(-1);
      openSketcher(false, index);
    };

    /**
     * Check whether there are changes in the sketcher. If so, show the popConfirm.
     * Otherwise, open the sketcher normally
     */
    const onEdit = () => {
      if (sketchChanges) {
        setPopIndex(index);
      } else {
        onDiscard();
      }
    };

    /** Delete the sketch */
    const onDelete = () => deleteSketch(index);

    // TODO: Make custom antd component that has a third button in the Popconfirm: cancel.

    return (
      <div
        key={`sketch${index.toString()}`}
        style={{
          // Change the background color if the index is the sketchIndex
          backgroundColor: index === sketchIndex ? '#dddddd' : '#ffffff',
        }}
      >
        <Popconfirm
          title="You have unsaved changes in the constraint sketcher. Do you want to save them?"
          okText="Save"
          cancelText="Discard"
          visible={popIndex === index}
          onConfirm={onSave}
          onCancel={onDiscard}
        >
          <Button onClick={onEdit}>Edit</Button>
        </Popconfirm>
        <SketchTranslation sketch={sketch} />
        <Button onClick={onDelete}>x</Button>
      </div>
    );
  });

  // Hooks for the visibility of the Popconfirm of the add sketch button
  const [visible, setVisible] = useState(false);

  /** Save the currentSketch and open the sketcher with a new sketch */
  const onSave = () => {
    setVisible(false);
    openSketcher(true);
  };

  /** Discard the currentSketch and open the sketcher with a new sketch */
  const onDiscard = () => {
    setVisible(false);
    openSketcher(false);
  };

  /**
   * Check whether there are changes in the sketcher. If so, show the popConfirm.
   * Otherwise, open the sketcher normally.
   */
  const onSketchAdd = () => {
    if (sketchChanges) {
      setVisible(true);
    } else {
      onDiscard();
    }
  };

  const formulaList = formulas.map((formula: string, index: number) => {
    const onDelete = () => deleteFormula(index);

    return (
      <div
        key={`formula${index.toString()}`}
        style={{
          // Change the background color if the index is the sketchIndex
          backgroundColor: index === formulaIndex ? '#dddddd' : '#ffffff',
        }}
      >
        <Space>
          <Text ellipsis copyable style={{ maxWidth: 300 }}>{formula}</Text>
          <Button size="small" onClick={onDelete}>x</Button>
        </Space>
      </div>
    );
  });

  return (
    <div className="WorkflowConstraintList" id="Constraints">
      <Row>
        <Col span={20}>
          <Checkbox
            onChange={(e) => setShowAdvancedConstraints(e.target.checked)}
          >
            Show advanced constraints
          </Checkbox>
        </Col>
        <Col span={4}>
          <Popconfirm
            title={
              <p>Are you sure you want to clear all constraints?<br />(Sketches not included)</p>
            }
            onConfirm={clearConstraints}
          >
            <Button size="small">Clear</Button>
          </Popconfirm>
        </Col>
      </Row>
      <div style={{ marginRight: 24 }}>
        <Divider />
      </div>
      <div style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '24px',
        marginBottom: '5px',
      }}
      >
        { workflowConstraintList }
      </div>
      <Button
        type="default"
        shape="round"
        onClick={onAdd}
        disabled={constraintOptions === undefined}
      >+ Add
      </Button>
      <div style={{ marginRight: 24 }}>
        <Divider>Sketches</Divider>
        { sketchList }
        <Popconfirm
          title="You have unsaved changes in the constraint sketcher. Do you want to save them?"
          okText="Save"
          cancelText="Discard"
          visible={visible}
          onConfirm={onSave}
          onCancel={onDiscard}
        >
          <Button
            type="default"
            shape="round"
            onClick={onSketchAdd}
            disabled={constraintOptions === undefined}
            style={{ marginTop: 10 }}
          >+ Add
          </Button>
        </Popconfirm>
      </div>
      <div>
        <Divider>SLTLx</Divider>
        { formulaList }
        <Button
          type="default"
          shape="round"
          onClick={onFormulaAdd}
          style={{ marginTop: 10 }}
        >+ Add
        </Button>
      </div>
    </div>
  );
}

export default WorkflowConstraintList;
