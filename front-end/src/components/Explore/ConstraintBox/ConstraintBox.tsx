/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Card } from 'antd';
import WorkflowConstraintList from '@components/WorkflowInput/WorkflowConstraintList';
import { Constraint, ConstraintType, Tool, Data, Ontology } from '@models/workflow/Workflow';
import styles from '@components/Explore/Box.module.less';
import TooltipIcon from '@components/TooltipIcon/TooltipIcon';
import { Sketch } from '@components/WorkflowInput/ConstraintSketcher/ConstraintSketcher';

/**
 * The props for the {@link ConstraintBox} component.
 */
interface ConstraintBoxProps {
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

  /**
   * OnAdd function for the add constraint button
   */
  onAdd: () => void;

  /**
   * OnRemove function to delete a constraint
   * @param index - the index of the constraint in the constraint list
   */
  onRemove: (index: number) => void;

  /** Open the sketcher at the given index. If index is undefined, open a new sketch */
  openSketcher: (save, boolean, index?: number) => void;

  /** Delete the sketch at the given index. */
  deleteSketch: (index: number) => void;

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

  /**
   * Callback function when the SLTLx editor should be opened.
   * @param save Whether the currently being editor formula should be saved.
   * @param index The index of the formula if the editor is to edit an existing formula.
   */
  openSLTLxEditor: (save: boolean, index?: number) => void;

  /** The current SLTLx formulas. */
  formulas: string[];
  /** The currently selected formula. */
  formulaIndex: number;
  deleteFormula: (index: number) => void;
}

/**
 * Card with constraints list for the explore page.
 *
 * Wrapper around {@link WorkflowConstraintList}.
 */
function ConstraintBox(props: ConstraintBoxProps) {
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
    openSLTLxEditor,
    formulas,
    formulaIndex,
    deleteFormula,
  } = props;

  return (
    <div className={styles.Box}>
      <Card
        title="Constraints"
        style={{ minWidth: 350, width: '100%' }}
        headStyle={{ background: '#F1634C' }}
        bodyStyle={{ paddingRight: 0 }}
        extra={(
          <TooltipIcon
            content={(
              <p>
                The constraint(s) to apply to the workflow.
                <ul>
                  <li>Show advanced constraints: show uncommon constraints types.</li>
                </ul>
              </p>
            )}
          />
        )}
      >
        <WorkflowConstraintList
          dataOntology={dataOntology}
          toolOntology={toolOntology}
          constraintOptions={constraintOptions}
          constraints={constraints}
          onChange={onChange}
          onAdd={onAdd}
          onRemove={onRemove}
          openSketcher={openSketcher}
          deleteSketch={deleteSketch}
          sketches={sketches}
          sketchChanges={sketchChanges}
          sketchIndex={sketchIndex}
          defaultData={defaultData}
          defaultTool={defaultTool}
          defaultConstraint={defaultConstraint}
          clearConstraints={clearConstraints}
          formulas={formulas}
          formulaIndex={formulaIndex}
          deleteFormula={deleteFormula}
          openSLTLxEditor={openSLTLxEditor}
        />
      </Card>
    </div>
  );
}

export default ConstraintBox;
