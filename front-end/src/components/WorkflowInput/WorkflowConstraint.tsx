/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Divider, Select, Row, Col } from 'antd';
import ToolSelector from '@components/WorkflowInput/ToolSelector';
import DataSelector from '@components/WorkflowInput/DataSelector';
import { Data, ConstraintType, ParameterType, Tool, Constraint, Ontology } from '@models/workflow/Workflow';
import styles from './WorkflowConstraint.module.less';

const { Option } = Select;

/**
 * The props for the {@link WorkflowConstraint} component
 */
interface WorkflowConstraintProps {
  /** The constraint that will be shown in this component */
  constraint: Constraint;

  /**
   * The index of the constraint in the constraint list in {@link WorkflowConstraintList}.
   */
  index: number;

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
   * OnRemove function to delete this constraint
   * @param index - the index of the constraint in the constraint list
   */
  onRemove: (index: number) => void;

  /** Default Constraint */
  defaultData: () => Data;
  defaultTool: () => Tool;
  defaultConstraint: () => Constraint;
}

/**
 * A constraint selector component.
 *
 * @param {props} props - Object containing all options, the constraint,
 * its index and the onChange and onRemove functions.
 * @return {HTMLElement} Returns a div with a select element for
 * the constraint type and for the parameters, and a remove button.
 */
function WorkflowConstraint(props: WorkflowConstraintProps) {
  const { constraint,
    index,
    dataOntology,
    toolOntology,
    constraintOptions,
    onChange,
    onRemove,
    defaultData,
    defaultTool,
    defaultConstraint } = props;

  /**
   * Check if the given value is valid and change the Constraint Type accordingly.
   *
   * @param {string} value - The value that has to be checked.
   */
  const onConstraintTypeChange = (value) => {
    if (value === undefined) {
      // Clear the constraint if the value is undefined (clear button has been pressed)
      onChange(index, defaultConstraint());
    } else {
      // If value is not undefined, set the value accordingly
      const copy: Constraint = constraint;
      copy.constraintType = constraintOptions.find(
        (option: ConstraintType) => option.id === value,
      );

      // Set default values for the parameters
      copy.parameters = copy.constraintType.parameterTypes.map((parameterType: ParameterType) => {
        switch (parameterType) {
          case ParameterType.Data:
            return defaultData();
          case ParameterType.Tool:
            return defaultTool();
          default:
            return undefined;
        }
      });
      onChange(index, copy);
    }
  };

  /*
   * Go over each parameter type in constraint type and return a parameter
   * div with the AutoComplete elements and all.
   */
  const parameters = constraint.constraintType.parameterTypes.map(
    (parameterType: ParameterType, parameterIndex: number) => {
      switch (parameterType) {
        case ParameterType.Data: {
          const parameter = constraint.parameters[parameterIndex] as Data;

          const onDataParamChange = (value: Data) => {
            const copy = constraint;

            copy.parameters[parameterIndex] = value;
            onChange(index, copy);
          };

          /*
           * Return a new div with the Input elements for the Data Type and
           * Data Format. The index is used for key, which React doesn't really
           * like, but I couldn't find a good solution.
           */
          return (
            <Row key={`parameter ${parameterIndex.toString()}`} className={styles.Parameters}>
              <Col span={1} style={{ paddingTop: '5px' }}>
                {`${parameterIndex + 1}.`}
              </Col>
              <Col span={23}>
                <DataSelector
                  dataOntology={dataOntology}
                  data={parameter}
                  onChange={onDataParamChange}
                />
              </Col>
            </Row>
          );
        }
        case ParameterType.Tool: {
          const parameter = constraint.parameters[parameterIndex] as Tool;

          const onToolParamChange = (value: Tool) => {
            const copy = constraint;

            copy.parameters[parameterIndex] = value;
            onChange(index, copy);
          };

          /*
           * Return a new div with the Input elements for the Tool. The
           * index is used for key, which React doesn't really
           * like, but I couldn't find a good solution.
           */
          return (
            <Row key={`parameter ${parameterIndex.toString()}`} className={styles.Parameters}>
              <Col span={1} style={{ paddingTop: '5px' }}>
                {`${parameterIndex + 1}.`}
              </Col>
              <Col span={23}>
                <ToolSelector
                  toolOntology={toolOntology}
                  tool={parameter}
                  onChange={onToolParamChange}
                />
              </Col>
            </Row>
          );
        }
        default:
          return undefined;
      }
    },
  );

  return (
    <div id={`Constraint${index}`}>
      <label>
        Constraint Type:
        <Select
          style={{ width: '100%' }}
          showSearch
          allowClear
          placeholder="Select constraint"
          onChange={onConstraintTypeChange}
          filterOption={(input, option) => (
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          )}
          value={constraint.constraintType.id}
        >
          {
            constraintOptions.map((constraintType, optionIndex) => (
              <Option
                value={constraintType.id}
                key={`OptionConstraint${index.toString()}Option${optionIndex.toString()}`}
              >
                {constraintType.description}
              </Option>
            ))
          }
        </Select>
      </label>

      <Row>
        <Col span={22}>
          { parameters }
        </Col>
        <Col span={1}>
          <Button
            className="delete"
            style={{ marginTop: 5, height: '100%' }}
            type="ghost"
            onClick={() => onRemove(index)}
          >
            <strong style={{ fontSize: '16px' }}>-</strong>
          </Button>
        </Col>
      </Row>
      <Divider />
    </div>
  );
}

export default WorkflowConstraint;
