/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Divider, message, Modal, Upload } from 'antd';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import WorkflowRun from '@components/WorkflowInput/WorkflowRun';
import InOutBox from '@components/Explore/InOutBox/InOutBox';
import ConstraintBox from '@components/Explore/ConstraintBox/ConstraintBox';
import { ConstraintsConfig } from '@models/Configuration/ConstraintsConfig';
import DownloadFile from '@helpers/DownloadFile';

import {
  Constraint,
  ConstraintType,
  Data,
  DataType,
  Ontology,
  OntologyNode,
  ParameterType,
  RunOptions,
  Tool,
} from '@models/workflow/Workflow';
import ConstraintSketcher, { Sketch } from '@components/WorkflowInput/ConstraintSketcher/ConstraintSketcher';
import { translateSketch } from '@components/WorkflowInput/ConstraintSketcher/SketchTranslation';
import { Config } from '@models/Configuration/Config';
import { FormInstance } from 'antd/lib/form';
import styles from './WorkflowInput.module.less';

/** The props for the {@link WorkflowInput} component */
interface WorkflowInputProps {
  /**
   * The onRun function that passes the parameters through to
   * the home page.
   * @param parameters The parameters in an object
   */
  onRun: (parameters: {}) => void;

  /** The data ontology */
  dataOntology: Ontology;

  /** The tool ontology */
  toolOntology: Ontology;

  /** List of constraint options */
  constraintOptions: ConstraintType[];

  /** Use case config of the domain */
  useCaseConfig: Config;

  /** Use case constraints of the domain */
  useCaseConstraints: ConstraintsConfig;

  /** The domain ID */
  domain: string;

  /** The run parameters limits */
  runParametersLimits: RunOptions;

  /** Function to download an ontology file */
  downloadOntologyFile: () => void;

  /** Function to download a tools annotations file */
  downloadToolsAnnotationsFile: () => void;
}

/** The state for the @{link WorkflowInput} component */
interface WorkflowInputState {
  /** List of the input data */
  inputs: Data[];

  /** List of the output data */
  outputs: Data[];

  /** List of the constraints */
  constraints: Constraint[];

  /** List of sketches */
  sketches: Sketch[];

  runOptions: RunOptions;

  /** The current sketch shown */
  currentSketch: Sketch;

  /** Sketch index */
  sketchIndex?: number;

  /** Changes in the current sketch */
  sketchChanges: boolean;

  /** Opened new sketch */
  sketchOpened: boolean;

  /** Boolean to check modal visibility */
  importModalEnabled: boolean;

  /** Boolean to check download modal visibility */
  downloadModalEnabled: boolean
}

/**
 * This component connects the {@link InOutBox}, {@link ConstraintBox},
 * and {@link WorkflowRun} components.
 * Together, they allow for configuring APE and geting the generated workflows from APE.
 */
class WorkflowInput extends React.Component<WorkflowInputProps, WorkflowInputState> {
  formRef = React.createRef<FormInstance>();

  constructor(props: any) {
    super(props);

    // All test data
    this.state = {
      inputs: [],
      outputs: [],
      constraints: [],
      sketches: [],
      currentSketch: undefined,
      sketchChanges: false,
      sketchOpened: false,
      importModalEnabled: false,
      downloadModalEnabled: false,
      runOptions: {
        id: 'noid',
        maxDuration: 10,
        solutions: 10,
        minLength: 1,
        maxLength: 10,
      },
    };
  }

  /**
   * Returns a default data with the type and format as the first options.
   * @param data The data to include in the newly created Data object.
   * @return {Data} - A default Data object.
   */
  defaultData = (data: string[] = []): Data => {
    const { dataOntology } = this.props;

    const values: DataType[] = [];
    dataOntology.roots.forEach((root, index) => {
      if (data && data[index]) {
        const value = data[index];
        const { id, label } = this.findInOntologyById(root, value);
        values.push({ label, id, type: root.id });
      } else {
        values.push({ label: undefined, id: undefined, type: undefined });
      }
    });

    return { values };
  };

  /**
   * Returns a default tool (first option in the list).
   *
   * @return {Tool} - A default Tool object.
   */
  defaultTool = (): Tool => ({
    label: undefined,
    type: undefined,
    id: undefined,
  });

  /**
   * Returns a default constraint (first option in the list). Parameters are
   * default values (defaultData and defaultTool).
   *
   * @return {Constraint} - A default Constraint object.
   */
  defaultConstraint = (): Constraint => ({
    constraintType: {
      description: undefined,
      id: undefined,
      parameterTypes: [],
    },
    parameters: [],
  });

  /**
   * Add a new default data to the end of the input list.
   */
  onInputAdd = (): void => {
    const { inputs } = this.state;
    inputs.push(this.defaultData());
    this.setState({ inputs });
  };

  /**
   * Change the input at the given index to the edited data.
   * @param index - index of the data in state.inputs.
   * @param newInput - the edited data.
   */
  onInputChange = (index: number, newInput: Data): void => {
    // I use index for now, might need a better solution for this
    const { inputs } = this.state;
    inputs[index] = newInput;
    this.setState({ inputs });
  };

  /**
   * Remove the input at given index.
   * @param index - index of the input.
   */
  onInputRemove = (index: number): void => {
    const { inputs } = this.state;
    inputs.splice(index, 1);
    this.setState({ inputs });
  };

  /**
   * Add a new default data to the end of the output list.
   */
  onOutputAdd = (): void => {
    const { outputs } = this.state;
    outputs.push(this.defaultData());
    this.setState({ outputs });
  };

  /**
   * Change the output at the given index to the edited data.
   * @param index - index of the data in state.inputs.
   * @param newOutput - the edited data.
   */
  onOutputChange = (index: number, newOutput: Data): void => {
    // I use index for now, might need a better solution for this
    const { outputs } = this.state;
    outputs[index] = newOutput;
    this.setState({ outputs });
  };

  /**
   * Remove the output at given index.
   * @param index - index of the output.
   */
  onOutputRemove = (index: number): void => {
    const { outputs } = this.state;
    outputs.splice(index, 1);
    this.setState({ outputs });
  };

  /**
   * Add a new default Constraint to the end of the list of Constraints.
   */
  onConstraintAdd = (): void => {
    const { constraints } = this.state;
    // Append the new constraint to the back of constraints
    constraints.push(this.defaultConstraint());
    this.setState({ constraints });
  };

  /**
   * Change the Constraint with index index to the edited constraint.
   * @param index - index of the constraint in state.constraints.
   * @param newConstraint - the edited Constraint.
   */
  onConstraintChange = (index: number, newConstraint: Constraint): void => {
    // I use index for now, might be a better solution for this
    const { constraints } = this.state;
    constraints[index] = newConstraint;
    this.setState({ constraints });
  };

  /**
   * Remove the Constraint at given index.
   * @param index - index of the constraint.
   */
  onConstraintRemove = (index: number): void => {
    const { constraints } = this.state;
    constraints.splice(index, 1);
    this.setState({ constraints });
  };

  /**
   * Check if an input/output/constraint type contains
   * an empty field. If that field is empty, we fill it in
   * with the root from the data ontology.
   * @param data The data to check
   * @returns A copy of the data that is filled in if needed.
   */
  setDataRoot = (data: Data) => {
    const { dataOntology } = this.props;
    const values = [];
    data.values.forEach((type, i) => {
      if (type.label === undefined) {
        const { label, id } = dataOntology.roots[i];
        values.push({ label, id, type: id });
      } else {
        values.push(type);
      }
    });
    const copy = data;
    copy.values = values;
    return copy;
  };

  /**
   * Filter the input and output list from empty entries.
   * @param data Input or output data list
   * @returns the filtered list without empty entries
   */
  filterInOut = (data: Data[]) => {
    const filtered = data.filter((elem) => {
      const { values } = elem;
      return values.some(
        (type) => !(type.type === undefined || type.label === undefined),
      );
    });

    return filtered.map((elem) => this.setDataRoot(elem));
  };

  /**
   * Filter the input and output from invalid entries and then refactor
   * the structure of each entry to the domain's required structure.
   * @param data Input or output data list
   * @returns the refactored list of data.
   */
  refactorInOut = (data: Data[]) => {
    const inputs = this.filterInOut(data);
    return inputs.map((elem) => this.domainify(elem));
  };

  /**
   * Refactor input/output data to the required domain structure.
   * @param data The data to refactor
   * @returns refactored data
   */
  domainify = (data: Data) => {
    const result = { taxonomyRoots: {} };
    data.values.forEach((elem) => {
      const key = elem.type;
      const val = elem.id;
      result.taxonomyRoots[key] = val;
    });
    return result;
  };

  /**
   * Filter the constraint from empty/invalid elements.
   * @param data List with all constraints currently in the state
   * @returns filtered list without empty/invalid constraints
   */
  filterConstraints = (data: Constraint[]) => {
    const filtered = data.filter((elem) => {
      const params = elem.parameters;
      const { constraintType } = elem;
      const { parameterTypes, description, id } = constraintType;
      const invalidConstraint = description === undefined || id === undefined;
      return !(
        invalidConstraint
        || this.invalidParameter(params, parameterTypes)
      );
    });
    /*
     * After filtering invalid elements, that is when a tool is not filled in
     * or when multiple fields from a type constraint are not filled in.
     * We check if there's any type constraints that have one field not filled in.
     * And replace that field with the root from datatypeoptions.
     */
    return filtered.map((elem) => {
      const { parameterTypes } = elem.constraintType;
      const parameters = [];
      elem.parameters.forEach((param, i) => {
        if (parameterTypes[i] === ParameterType.Data) {
          parameters.push(this.setDataRoot(param as Data));
        } else {
          parameters.push(param);
        }
      });
      const copy = elem;
      copy.parameters = parameters;
      return copy;
    });
  };

  /**
   * Check if a list of parameters contains an invalid element.
   * @param data List of data types
   * @param types List of types of parameter types (on index)
   * @returns boolean to indicate an invalid element is present.
   */
  invalidParameter = (data: (Data | Tool)[], types: ParameterType[]) => data.some((elem, i) => {
    switch (types[i]) {
      case ParameterType.Data: {
        const { values } = (elem as Data);
        return values.every((type) => type.type === undefined);
      }
      case ParameterType.Tool:
        return (elem as Tool).type === undefined;
      default:
        return true;
    }
  });

  /**
   * Close the sketcher
   * @param save - whether to save the currentSketch or not
   */
  closeSketch = (save: boolean) => {
    if (save) {
      this.saveCurrentSketch();
    }
    this.setState({ currentSketch: undefined, sketchIndex: undefined, sketchChanges: false });
  };

  /**
   * Save the currentSketch into the sketches array at sketchIndex if sketchIndex
   * is not undefined. Else, push the currentSketch to the end of the sketches array.
   */
  saveCurrentSketch = () => {
    const { sketches, sketchIndex, currentSketch } = this.state;

    const sketch: Sketch = {
      tools: currentSketch.tools.filter((tool: Tool) => tool.id !== undefined),
    };

    if (sketch.tools.length === 0) {
      if (sketchIndex !== undefined) {
        this.deleteSketch(sketchIndex);
      } else {
        return;
      }
    } else if (sketchIndex !== undefined) {
      sketches[sketchIndex] = sketch;
    } else {
      sketches.push(sketch);
    }

    this.setState({ sketches });
  };

  /**
   * Delete the sketch at the given index
   * @param index - the index of the sketch that will be deleted
   */
  deleteSketch = (index: number) => {
    const { sketches, sketchIndex } = this.state;
    sketches.splice(index, 1);

    /*
     * If the index is the same as the sketchIndex, you have to reset the sketchIndex as well.
     * The sketcher stays open, but the currentSketch will be handled like a 'new' sketch.
     */
    this.setState({
      sketches,
      sketchIndex: sketchIndex === index ? undefined : sketchIndex,
    });
  };

  /**
   * Open the Constraint sketcher
   * @param save - if true, the currentSketch will be saved first
   * @param index - (optional) the index of the sketch in sketches. If undefined,
   * open a new sketch.
   */
  openSketcher = (save: boolean, index?: number): void => {
    const { sketches } = this.state;

    if (save) {
      this.saveCurrentSketch();
    }
    const currentSketch: Sketch = index === undefined
      ? { tools: [] } : JSON.parse(JSON.stringify(sketches[index]));

    this.setState({
      sketchIndex: index,
      currentSketch,
      sketchChanges: false,
    });

    this.setSketchOpened(true);
  };

  /**
   * Save the changes to the currentSketch and set teh sketchChange to true
   * @param sketch - the edited sketch
   */
  onSketchChange = (sketch: Sketch): void => {
    this.setState({ currentSketch: sketch, sketchChanges: true });
  };

  /**
   * Set function for sketchOpened in the state
   * @param sketchOpened - the new value
   */
  setSketchOpened = (sketchOpened: boolean) => this.setState({ sketchOpened });

  /**
   * Filter the the constraints and then refactor them to
   * the structure required by ape.
   * @param data List with all constraints currently in the state
   * @returns refactored list of filtered constraints
   */
  refactorConstraints = (data: Constraint[]) => {
    const constraints = this.filterConstraints(data);
    return constraints.map((elem) => {
      const { constraintType, parameters } = elem;
      const { id, description, parameterTypes } = constraintType;
      const params = this.refactorParameters(parameters, parameterTypes);
      return {
        id,
        description,
        parameters: params,
      };
    });
  };

  /**
   * Refactor the parameters to the expected format for ape.
   * @param data List of data types
   * @param types List of types of parameter types (on index)
   * @returns list of refactored parameters.
   */
  refactorParameters = (data: (Data | Tool)[], types: ParameterType[]) => data.map((elem, i) => {
    switch (types[i]) {
      case ParameterType.Data: {
        return this.domainify(elem as Data);
      }
      case ParameterType.Tool: {
        const result = { taxonomyRoots: {} };
        result.taxonomyRoots[(elem as Tool).type] = (elem as Tool).id;
        return result;
      }
      default:
        return undefined;
    }
  });

  onRun = (runOptions: RunOptions): Promise<void> => {
    const { inputs, outputs, constraints, sketches } = this.state;
    const { onRun } = this.props;
    onRun([]); // Force a re-render so current data is hidden instantly on click
    const input = this.refactorInOut(inputs);
    const expectedOutput = this.refactorInOut(outputs);
    const allConstraints = this.refactorConstraints(
      constraints.concat(sketches.flatMap(translateSketch)),
    );
    const body = { input, expectedOutput, constraints: allConstraints, ...runOptions };
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    const runEndpoint = `${base}/api/workflow/run`;

    if (input.length === 0 || expectedOutput.length === 0) {
      // Check if the data is complete yet. If not, send a error message and don't fetch
      return Promise.resolve(message.error('The input and/or output fields are empty.'));
    }

    // Send user data to back-end to get results
    return fetch(runEndpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject(res.json());
        }
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          return Promise.resolve(onRun(data));
        }
        return Promise.resolve(message.warning('APE could not find any results'));
      })
      .catch((error) => {
        // Await error parsing
        error.then((data: any) => {
          message.error(data.message, 5);
        });
      });
  };

  /**
   * Downloads the configuration file from the back-end.
   */
  downloadConfigFile = (): void => {
    const { state } = this;
    const input = this.refactorInOut(state.inputs);
    const expectedOutput = this.refactorInOut(state.outputs);
    const constraints = this.refactorConstraints(state.constraints);
    const { runOptions } = this.state;
    const body = {
      input,
      expectedOutput,
      constraints,
      maxLength: runOptions.maxLength,
      minLength: runOptions.minLength,
      maxDuration: runOptions.maxDuration,
      solutions: runOptions.solutions,
    };
    const base = process.env.NEXT_PUBLIC_BASE_URL;
    const runEndpoint = `${base}/api/workflow/config`;

    // Send user data to back-end to get results
    fetch(runEndpoint, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    }).then((response:Response) => {
      response.blob()
        .then((blob) => { DownloadFile(blob, 'config.zip'); });
    })
      .catch((error) => console.error('Error downloading the configuration files :(.', error));
  };

  /**
   * Imports the input and output data of a config.json file.
   * @param newInputs the inputs to be imported.
   * @param newOutputs the outputs to be imported.
   */
  importInputOutput = (newInputs, newOutputs) => {
    let inputs = [];
    let outputs = [];

    try {
      newInputs.forEach((input) => {
        const inputLabels = [];
        Object.keys(input).forEach((key) => {
          inputLabels.push(input[key][0]);
        });

        const newInput = this.defaultData(inputLabels);

        inputs.push(newInput);
      });

      newOutputs.forEach((output) => {
        const outputLabels = [];
        Object.keys(output).forEach((key) => {
          outputLabels.push(output[key][0]);
        });

        const newOutput = this.defaultData(outputLabels);

        outputs.push(newOutput);
      });
    } catch (exc) {
      inputs = [];
      outputs = [];
      message.error('Something went wrong while importing inputs/outputs. Please check the inputs/outputs in your config.json and try again.');
    }

    this.setState({ inputs, outputs });
  };

  /**
   * Finds an OntologyNode in an Ontology based on its id
   * @param node the OntologyNode to start searching.
   * @param id the id of the desired OntologyNode.
   * @return the node of the found OntologyNode.
   */
  findInOntologyById = (node: OntologyNode, id: string) => {
    if (node.id === id) {
      return { id: node.id, label: node.label };
    }

    let output = null;
    if (node.children !== null) {
      node.children.some((child) => {
        output = this.findInOntologyById(child, id);
        return output !== null;
      });
    }
    return output;
  };

  /**
   * Imports constraints from a constraints.json file
   * @param newConstraints The constraints to import.
   */
  importConstraints = (newConstraints: ConstraintsConfig) => {
    const { toolOntology, dataOntology } = this.props;

    let constraints = [];

    try {
      newConstraints.constraints.forEach((constraint) => {
        const newConstraint = this.defaultConstraint();

        newConstraint.constraintType = this.getConstraintTypeById(constraint.constraintid);
        constraint.parameters.forEach((parameter) => {
          if (Object.keys(parameter).some((key) => key === toolOntology.roots[0].id)) {
            const value = parameter[toolOntology.roots[0].id][0];
            const { id, label } = this.findInOntologyById(toolOntology.roots[0], value);
            newConstraint.parameters.push({
              label,
              type: toolOntology.roots[0].id,
              id,
            });
          } else {
            const newData: Data = { values: [] };
            Object.keys(parameter).forEach((key) => {
              const value = parameter[key][0];
              const ontologyRoot = dataOntology.roots.find(
                (node: OntologyNode) => node.id === key,
              );

              const { id, label } = this.findInOntologyById(ontologyRoot, value);

              newData.values.push({
                label,
                id,
                type: ontologyRoot.id,
              });
            });
            newConstraint.parameters.push(newData);
          }
        });
        constraints.push(newConstraint);
      });
    } catch (exc) {
      constraints = [];
      message.error('Something went wrong while loading the constraints. Please check your constraints.json file and try again.');
    }

    this.setState({ constraints });
  };

  importConfigs = (json): void => {
    /** Update the states */
    const { runParametersLimits } = this.props;
    let { runOptions } = this.state;
    const runOptionsCopy = runOptions;
    try {
      const { minLength, maxLength, maxDuration, solutions } = runParametersLimits;
      const clamp = (num: number, lower: number, upper: number): number => (
        Math.max(Math.min(num, upper), lower)
      );

      // Set the run options, with their limits
      runOptions.minLength = clamp(json.solution_length.min, 0, minLength);
      runOptions.maxLength = clamp(json.solution_length.max, 0, maxLength);
      runOptions.maxDuration = clamp(+json.timeout_sec, 0, maxDuration);
      runOptions.solutions = clamp(+json.max_solutions, 0, solutions);
    } catch (exc) {
      runOptions = runOptionsCopy;
      message.error('Something went wrong while importing run parameters. Please check the run parameters in your config.json and try again.');
    }
    this.setState({ runOptions });
    /* Update the form values */
    this.formRef.current!.setFieldsValue(runOptions);
  };

  /**
   * Gets a ConstraintType based on its id
   * @param constraintId the id of the desired ConstraintType.
   * @return The ConstraintType with the given id.
   */
  getConstraintTypeById = (constraintId: string) => {
    const { constraintOptions } = this.props;
    return constraintOptions.find(
      (constraintOption) => (constraintOption.id === constraintId),
    );
  };

  /**
   * Enables the import modal.
   */
  enableImportModal = () => {
    this.setState({ importModalEnabled: true });
  };

  /**
   * Disables the import modal.
   */
  disableImportModal = () => {
    this.setState({ importModalEnabled: false });
  };

  /**
   * Enables the export modal
   */
  enableDownloadModal = () => {
    this.setState({ downloadModalEnabled: true });
  };

  /**
   * Disables the export modal
   */
  disableDownloadModal = () => {
    this.setState({ downloadModalEnabled: false });
  };

  /**
   * Reads and imports a config.json file
   * @param info A constraints.json file.
   */
  importConfigurationFile = (info) => {
    if (info.file.status !== 'uploading') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          /** Read the contents of the json file */
          const fileJson: Config = JSON.parse(e.target.result);
          this.importConfigs(fileJson);
          this.importInputOutput(fileJson.inputs, fileJson.outputs);
        }
      };
      /* Read the file when it's done uploading */
      reader.readAsText(info.file.originFileObj);
    }
    if (info.file.status === 'done') {
      message.success('Configuration updated!');
    } else if (info.file.status === 'error') {
      message.error('File upload failed. Please try again.');
    }
  };

  /**
   * Reads and imports a constraints.json file
   * @param info A constrains.json file.
   */
  importConstraintConfigurationFile = (info) => {
    if (info.file.status !== 'uploading') {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target.result === 'string') {
          /** Read the contents of the file and import the constraints */
          const fileJson: ConstraintsConfig = JSON.parse(e.target.result);
          this.importConstraints(fileJson);
        }
      };
      /** Read the file when it's done uploading */
      reader.readAsText(info.file.originFileObj);
    }
    if (info.file.status === 'done') {
      message.success('Constraint configuration updated!');
    } else if (info.file.status === 'error') {
      message.error('File upload failed. Please try again.');
    }
  };

  /**
   * Updates the run options
   * @param changed updated run options
   */
  updateRunOptions = (changed: RunOptions) => {
    /*
     * Handle each changed field, there can be more than one changed
     * if the the predicate min <= max if violated.
     */

    const { runOptions } = this.state;
    Object.entries(changed).forEach(([key, val]) => {
      // Check if value value is a valid number
      if (typeof val === 'number' && !Number.isNaN(val)) {
        runOptions[key] = val;
      }
    });
    this.setState({ runOptions });
  };

  /** Load the use case */
  loadUseCase = () => {
    const { useCaseConfig, useCaseConstraints } = this.props;

    if (useCaseConfig) {
      // If the use case is null or undefined
      const { inputs, outputs } = useCaseConfig;

      this.importInputOutput(inputs, outputs);
      this.importConfigs(useCaseConfig);
    }

    if (useCaseConstraints) {
      this.importConstraints(useCaseConstraints);
    }
  };

  render() {
    const {
      constraints,
      inputs,
      outputs,
      sketches,
      sketchIndex,
      sketchChanges,
      sketchOpened,
      currentSketch,
      importModalEnabled,
      downloadModalEnabled,
      runOptions,
    } = this.state;

    const {
      dataOntology,
      toolOntology,
      constraintOptions,
      downloadOntologyFile,
      downloadToolsAnnotationsFile,
      useCaseConfig,
      useCaseConstraints,
      runParametersLimits,
    } = this.props;

    return (
      <div className="WorkflowInput">
        <div className={styles.ImportExport}>
          <Button
            type="default"
            onClick={this.enableImportModal}
            style={{ marginLeft: '4%', marginRight: '10px', display: 'inline-flex' }}
          >
            <UploadOutlined className={styles.Icon} />
            Upload
          </Button>
          <Button
            type="default"
            onClick={this.enableDownloadModal}
            style={{ display: 'inline-flex', marginRight: '10px' }}
          >
            <DownloadOutlined className={styles.Icon} />
            Download
          </Button>
          {
            (useCaseConfig || useCaseConstraints)
          && (
          <Button onClick={this.loadUseCase} style={{ display: 'inline-flex' }}>
            <DownloadOutlined className={styles.Icon} />Load use case
          </Button>
          )
          }
        </div>
        <div className={styles.Boxes}>
          {/* Input */}
          <InOutBox
            title="Input"
            headerText="Input Data"
            dataOntology={dataOntology}
            onChange={this.onInputChange}
            onAdd={this.onInputAdd}
            onRemove={this.onInputRemove}
            inOuts={inputs}
            tooltip="The input(s) you want your workflow to have."
          />
          {/* Output */}
          <InOutBox
            title="Output"
            headerText="Output Data"
            dataOntology={dataOntology}
            onChange={this.onOutputChange}
            onAdd={this.onOutputAdd}
            onRemove={this.onOutputRemove}
            inOuts={outputs}
            tooltip="The output(s) you want your workflow to have."
          />
          {/* Constraints */}
          <ConstraintBox
            dataOntology={dataOntology}
            toolOntology={toolOntology}
            constraintOptions={constraintOptions}
            constraints={constraints}
            onChange={this.onConstraintChange}
            onAdd={this.onConstraintAdd}
            onRemove={this.onConstraintRemove}
            openSketcher={this.openSketcher}
            deleteSketch={this.deleteSketch}
            sketches={sketches}
            sketchChanges={sketchChanges}
            sketchIndex={sketchIndex}
            defaultData={this.defaultData}
            defaultTool={this.defaultTool}
            defaultConstraint={this.defaultConstraint}
          />
          {/* Run */}
          <WorkflowRun
            onRun={this.onRun}
            runOptions={runOptions}
            formRef={this.formRef}
            updateRunOptions={this.updateRunOptions}
            runParametersLimits={runParametersLimits}
          />
        </div>
        {/* Constraint sketcher, only open if the currentSketch is not undefined */}
        { currentSketch && (
          <ConstraintSketcher
            toolOntology={toolOntology}
            onSubmit={this.closeSketch}
            onChange={this.onSketchChange}
            sketch={currentSketch}
            sketchOpened={sketchOpened}
            setSketchOpened={this.setSketchOpened}
            defaultTool={this.defaultTool}
          />
        ) }
        <Modal
          title="Import configuration"
          visible={importModalEnabled}
          onOk={this.disableImportModal}
          onCancel={this.disableImportModal}
          footer={[
            <Button type="primary" onClick={this.disableImportModal} key="ImportConfirmButton">
              Close
            </Button>,
          ]}
        >
          <Upload
            accept=".json"
            onChange={this.importConfigurationFile}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} block size="large">Upload configuration file</Button>
          </Upload>
          <Divider />
          <Upload
            accept=".json"
            onChange={this.importConstraintConfigurationFile}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />} block size="large">Upload constraint configuration file</Button>
          </Upload>
        </Modal>
        <Modal
          title="Download configuration"
          visible={downloadModalEnabled}
          onOk={this.disableDownloadModal}
          onCancel={this.disableDownloadModal}
          footer={[
            <Button type="primary" onClick={this.disableDownloadModal} key="DownloadConfirmButton">
              Close
            </Button>,
          ]}
        >
          <Button
            icon={<DownloadOutlined />}
            block
            size="large"
            onClick={this.downloadConfigFile}
          >Download configuration files (.zip)
          </Button>
          Remember to update the local path values in the config.json for your correct path!
          <Divider />
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadOntologyFile}
            block
            size="large"
          >Download ontology file (.owl/.rdf)
          </Button>
          <Divider />
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadToolsAnnotationsFile}
            block
            size="large"
          >Download tools annotations file (.json)
          </Button>
        </Modal>
      </div>
    );
  }
}

export default WorkflowInput;
