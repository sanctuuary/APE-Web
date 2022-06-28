/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable max-len */
/* eslint-disable capitalized-comments */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
/* eslint-disable no-loop-func */
import React from 'react';
import { render, queryByAttribute, getByRole, fireEvent, getByLabelText } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkflowInput from '@components/WorkflowInput/WorkflowInput';
import { ConstraintType, Data, DataType, ParameterType, Tool, Constraint } from '@models/workflow/Workflow';
import { listedTestData, listedTestTools, testConstraints } from '../../data/WorkflowInput';

describe.skip('Workflow input', () => {
  const getById = queryByAttribute.bind(null, 'id');

  let inputs;
  let outputs;
  let constraints;
  let run;
  let constraintOptions: ConstraintType[];
  let toolOptions: Tool[];
  let dataTypes: { head: DataType; list: DataType[] }[];

  const onRun = (parameters: {}): void => {
    console.log(parameters);
  };

  beforeAll(() => {
    dataTypes = listedTestData.map((type) => ({
      head: type[0],
      list: type.slice(1),
    }));

    constraintOptions = testConstraints;
    toolOptions = listedTestTools;
  });

  beforeEach(() => {
    const { container } = render(
      <WorkflowInput
        dataTypeOptions={listedTestData}
        toolOptions={listedTestTools}
        constraintOptions={testConstraints}
        onRun={onRun}
      />,
    );

    /*
     * Put inputs, outputs, constraints and run in objects with their
     * HTMLElement and button
     */
    const inputsContainer = getById(container, 'Input') as HTMLElement;
    const inputsAddBtn = getByRole(
      inputsContainer,
      'button',
    ) as HTMLButtonElement;
    inputs = {
      container: inputsContainer,
      button: inputsAddBtn,
    };

    const outputsContainer = getById(container, 'Output') as HTMLElement;
    const outputsAddBtn = getByRole(
      outputsContainer,
      'button',
    ) as HTMLButtonElement;
    outputs = {
      container: outputsContainer,
      button: outputsAddBtn,
    };

    const constraintsContainer = getById(
      container,
      'Constraints',
    ) as HTMLElement;
    const constraintsAddBtn = getByRole(
      constraintsContainer,
      'button',
    ) as HTMLButtonElement;
    constraints = {
      container: constraintsContainer,
      button: constraintsAddBtn,
    };

    const runContainer = getById(container, 'Run') as HTMLElement;
    const runButton = getById(runContainer, 'submit') as HTMLButtonElement;
    run = {
      container: runContainer,
      button: runButton,
    };
  });

  test('assert input/output/constraints/run divs', () => {
    // For each element, check if the container and button are in the document.
    [inputs, outputs, constraints, run].forEach((element) => {
      expect(element.container).toBeInTheDocument();
      expect(element.button).toBeInTheDocument();
    });
  });

  test('add three unique inputs and outputs and delete the first ones', () => {
    /*
     * Make the data options unique by making pairs with the type and format by index.
     * Assume there are more at least 3 options for both type and format, otherwise
     * choose the minimal amount
     */
    const amount = Math.min(3, dataTypes.length);

    const dataLists = [
      {
        ...inputs,
        title: 'Input',
      },
      {
        ...outputs,
        title: 'Output',
      },
    ];

    dataLists.forEach((dataList) => {
      for (let paramIndex = 0; paramIndex < amount; paramIndex += 1) {
        userEvent.click(dataList.button);
        const parentDiv = getById(
          dataList.container,
          dataList.title + paramIndex,
        );

        // Loop over each data type and change the value
        dataTypes.forEach((dataType: { head: DataType; list: DataType[] }) => {
          /*
           * Change the data and check whether the input element has changed
           * accordingly. The values are stored in WorkflowInput.state and onChange
           * is passed back up to this class.
           */
          const input = getById(
            parentDiv,
            dataType.head.label,
          ) as HTMLInputElement;
          const value = dataType.list[paramIndex].label;
          userEvent.type(input, value);
          expect(input.value).toBe(value);
        });
      }

      const deleteButton = dataList.container.getElementsByClassName(
        'delete',
      )[0] as HTMLElement;
      userEvent.click(deleteButton);

      for (let dataIndex = 0; dataIndex < amount - 1; dataIndex += 1) {
        const parentDiv = getById(
          dataList.container,
          dataList.title + dataIndex,
        );

        /*
         * The first element was deleted, so the list should consist of
         * elements with the options at index input + 1
         */
        dataTypes.forEach((type: { head: DataType; list: DataType[] }) => {
          const input = getById(parentDiv, type.head.label) as HTMLInputElement;
          expect(input.value).toBe(type.list[dataIndex + 1].label);
        });
      }

      // Check whether the last input field is deleted correctly
      expect(
        getById(dataList.container, dataList.title + (amount - 1)),
      ).not.toBeInTheDocument();
    });
  });

  test('decline unallowed run option values', () => {
    const options: { input: HTMLInputElement, value: any }[] = [
      {
        input: getByLabelText(run.container, 'Max duration') as HTMLInputElement,
        value: 'string, not allowed',
      },
      {
        input: getByLabelText(run.container, 'Min length') as HTMLInputElement,
        value: -1,
      },
      {
        input: getByLabelText(run.container, 'Max length') as HTMLInputElement,
        value: 10000,
      },
    ];
    options.forEach((option: { input: HTMLInputElement, value: any }) => {
      fireEvent.change(option.input, {
        target: {
          value: option.value,
        },
      });
    });
  });

  test('add three unique constraints and delete the first one', () => {
    /*
     * Make the constraints unique by choosing 3 different constraintTypes.
     * Assume there are more at least 3 types, otherwise choose the minimal amount
     */
    const amount = Math.min(3, constraintOptions.length);

    for (let constraint = 0; constraint < amount; constraint += 1) {
      userEvent.click(constraints.button);
      const parentDiv = getById(
        constraints.container,
        `Constraint${constraint}`,
      );
      const constraintType = constraintOptions[constraint];

      const select = getById(parentDiv, 'ConstraintType') as HTMLInputElement;
      userEvent.type(select, constraintType.description);
      expect(select.value).toBe(constraintType.description);

      /*
       * ESLint didn't like that I used dataTypes and toolOptions, but I doesn't look
       * Like I violate any of the stated rules on https://eslint.org/docs/rules/no-loop-func
       */
      constraintType.parameterTypes.forEach(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (parameterType: ParameterType, paramIndex: number) => {
          switch (parameterType) {
            case ParameterType.Data: {
              const paramDiv = getById(parentDiv, `DataParameter${paramIndex}`);

              /*
               * Change the data and check whether the input elements are changed
               * accordingly. The values are stored in WorkflowInput.state and onChange
               * is passed back up to this class.
               */
              dataTypes.forEach((dataType) => {
                const input = getById(
                  paramDiv,
                  dataType.head.label,
                ) as HTMLInputElement;
                const value = dataType.list[paramIndex].label;
                userEvent.type(input, value);
                expect(input.value).toBe(value);
              });
              break;
            }
            case ParameterType.Tool: {
              const paramDiv = getById(parentDiv, `ToolParameter${paramIndex}`);
              const input = getById(paramDiv, 'Tool');

              const value = toolOptions[paramIndex].label;

              /*
               * Change the data and check whether the select elements are changed
               * accordingly. The values are stored in WorkflowInput.state and onChange
               * is passed back up to this class.
               */
              userEvent.type(input, value);
              expect(input.value).toBe(value);

              break;
            }
            default: {
              console.error('Parameter type does not equal "data" or "tool"');
              break;
            }
          }
        },
      );
    }

    // Delete the first constraint
    userEvent.click(
      getByRole(getById(constraints.container, 'Constraint0'), 'button'),
    );

    // Check whether the constraints get shifted correctly (Constraint 2 becomes Constraint 1 etc)
    for (
      let constraintIndex = 0;
      constraintIndex < amount - 1;
      constraintIndex += 1
    ) {
      const parentDiv = getById(
        constraints.container,
        `Constraint${constraintIndex}`,
      );
      const constraintType = constraintOptions[constraintIndex + 1];

      const select = getById(parentDiv, 'ConstraintType');
      expect(select.value).toBe(constraintType.description);

      constraintType.parameterTypes.forEach(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (parameterType: string, paramIndex: number) => {
          switch (parameterType) {
            case ParameterType.Data: {
              const paramDiv = getById(parentDiv, `DataParameter${paramIndex}`);

              dataTypes.forEach((dataType) => {
                const input = getById(
                  paramDiv,
                  dataType.head.label,
                ) as HTMLInputElement;
                expect(input.value).toBe(dataType.list[paramIndex].label);
              });

              break;
            }
            case ParameterType.Tool: {
              const paramDiv = getById(parentDiv, `ToolParameter${paramIndex}`);
              const toolSel = getById(paramDiv, 'Tool');

              expect(toolSel.value).toBe(toolOptions[paramIndex].label);

              break;
            }
            default: {
              console.error('Parameter type does not equal "data" or "tool"');
              break;
            }
          }
        },
      );
    }

    // Check whether the last input field is deleted correctly
    expect(
      getById(constraints.container, `Constraint${amount - 1}`),
    ).not.toBeInTheDocument();
  });

  test('add "random" inputs, outputs, constraints, run options and run query', () => {
    // Create inputs and outputs
    const dataLists: {
      container: HTMLElement;
      button: HTMLElement;
      title: string;
    }[] = [
      {
        ...inputs,
        title: 'Input',
      },
      {
        ...outputs,
        title: 'Output',
      },
    ];

    /**
     * Create a data entry and add it to the parentDiv. Values will be the options at
     * given a given index. Test along the way for correct throughput of the values.
     * @param parentDiv - the element with the input fields.
     * @param optionIndex - the index of the option.
     * @return Data - the newly created data entry.
     */
    const createData = (parentDiv: HTMLElement, optionIndex: number): Data => {
      const values = dataTypes.map((dataType) => {
        const input = getById(
          parentDiv,
          dataType.head.label,
        ) as HTMLInputElement;
        expect(input).toBeInTheDocument();

        const value = dataType.list[optionIndex];

        userEvent.type(input, value.label);

        return value;
      });

      return { values };
    };

    /**
     * Create a tool and add it to the parentDiv. The tool will be the option at
     * given a given index. Test along the way for correct throughput of the values.
     * @param parentDiv - the element with the input fields.
     * @param optionIndex - the index of the option.
     * @return Tool - the newly created tool.
     */
    const createTool = (parentDiv: HTMLElement, optionIndex: number): Tool => {
      const input = getById(parentDiv, 'Tool');
      expect(input).toBeInTheDocument();

      const tool = toolOptions[optionIndex];

      userEvent.type(input, tool.label);

      // Push the tool to the list of parameters
      return tool;
    };

    /**
     * Create a constraint with the given constraint type, but "random" value for the parameters.
     * The values of parameters are equal to the option with the parameter index.
     * @param constraintType - the constraint type.
     * @param parentDiv - the element with the input fields.
     */
    const createConstraint = (
      constraintType: ConstraintType,
      parentDiv: HTMLElement,
    ) => {
      const input = getById(parentDiv, 'ConstraintType');
      expect(input).toBeInTheDocument();

      userEvent.type(input, constraintType.description);

      const parameters = constraintType.parameterTypes.map(
        (parameterType: ParameterType, parameterIndex: number) => {
          switch (parameterType) {
            case ParameterType.Data: {
              const paramDiv = getById(
                parentDiv,
                `DataParameter${parameterIndex}`,
              );
              expect(paramDiv).toBeInTheDocument();

              // Create a data entry
              return createData(paramDiv, parameterIndex);
            }
            case ParameterType.Tool: {
              const paramDiv = getById(
                parentDiv,
                `ToolParameter${parameterIndex}`,
              );
              expect(paramDiv).toBeInTheDocument();

              return createTool(paramDiv, parameterIndex);
            }
            default:
              // Default to handle an invalid parameter to see if it gets filtered on run
              return {
                label: 'I am invalid',
                type: undefined,
              };
          }
        },
      );
      return { constraintType, parameters };
    };

    const dataAmount = Math.min(
      3,
      ...dataTypes.map((type) => type.list.length),
    );

    dataLists.forEach((dataList) => {
      for (let dataIndex = 0; dataIndex < dataAmount; dataIndex += 1) {
        userEvent.click(dataList.button);

        const parentDiv = getById(
          dataList.container,
          dataList.title + dataIndex,
        );
        expect(parentDiv).toBeInTheDocument();

        createData(parentDiv, dataIndex);
      }
    });

    /*
     * Get all unique parameter combinations:
     * (1 tool, 2 tools, 1 data, 2 data, maybe more later?)
     */
    const uniqueOptions: ConstraintType[] = [];
    const map = new Map();
    constraintOptions.forEach((item: ConstraintType) => {
      const key = item.parameterTypes.join();
      if (!map.has(key)) {
        map.set(key, true); // Set the new combination in Map
        uniqueOptions.push(item);
      }
    });

    /*
     * For each unique option, create a constraint with "random" values for
     * the parameters.
     */
    const constraintList = uniqueOptions.map(
      (constraintType: ConstraintType, constraintIndex: number): Constraint => {
        userEvent.click(constraints.button);

        const parentDiv = getById(
          constraints.container,
          `Constraint${constraintIndex}`,
        );
        expect(parentDiv).toBeInTheDocument();

        return createConstraint(constraintType, parentDiv);
      },
    );

    /**
     * Add invalid option to the constraints as well.
     * This is done by:
     * (1) Not selecting any of the fields on it,
     * which leaves the parameters array empty.
     * (2) Or by selecting a label/constraint but no parameters.
     */
    const invalidConstraintLabel: ConstraintType = {
      description: undefined,
      id: undefined,
      parameterTypes: [],
    };

    const invalidConstraintParams: ConstraintType = {
      description: 'I have invalid parameters',
      id: 'this_id_is_fine_however',
      parameterTypes: [undefined],
    };

    const invalidConstraintTypes: ConstraintType[] = [
      invalidConstraintLabel,
      invalidConstraintParams,
    ];

    // The current amount of constraints
    const constraintAmount = constraintList.length;

    /*
     * Try to create a constraint for each invalid constraint type
     * and add them to the constraint list.
     */
    constraintList.push(
      ...invalidConstraintTypes.map(
        (constraintType: ConstraintType, constraintIndex: number) => {
          userEvent.click(constraints.button);
          const parentDiv = getById(
            constraints.container,
            `Constraint${constraintAmount + constraintIndex}`,
          );
          expect(parentDiv).toBeInTheDocument();

          return createConstraint(constraintType, parentDiv);
        },
      ),
    );

    const options = [
      getByLabelText(run.container, 'Max duration') as HTMLInputElement,
      getByLabelText(run.container, 'Solutions') as HTMLInputElement,
      getByLabelText(run.container, 'Min length') as HTMLInputElement,
      getByLabelText(run.container, 'Max length') as HTMLInputElement,
    ];
    options.forEach((input: HTMLInputElement, optionIndex: number) => {
      expect(input).toBeInTheDocument();

      const min = Number(input.min);
      const max = Number(input.max);

      /*
       * TODO: only test for values in the given range, should add feature
       *   that the data get checked somewhere else too
       */
      let value = Math.max(optionIndex, min);
      value = Math.min(value, max);

      fireEvent.change(input, {
        target: {
          value,
        },
      });
    });

    // Run the query
    userEvent.click(run.button);

    // TODO: see if query input gets sent correctly
  });
});
