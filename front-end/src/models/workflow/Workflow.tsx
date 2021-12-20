/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/** Interface for a node in an ontology */
interface OntologyNode {
  /** The text that will be shown */
  label: string;
  /** The unique identifier */
  id: string;
  /** The children nodes */
  children: OntologyNode[];
}

/** Interface for storing data and tool ontologies */
interface Ontology {
  /** The title of the ontology */
  title: string;

  /** The unique identifier */
  id: string;

  /** The roots of the ontology (e.g. data dimensions) */
  roots: OntologyNode[];
}

/** A value for a data type */
interface DataType {
  /** The displayed text */
  label: string;
  /** The type of the data */
  type: string;
  /** Identifier of this DataType */
  id: string;
}

/**
 * Interface for a data entry
 */
interface Data {
  /**
   * List with values for each data dimension. Values.length should
   * be equal to the amount of roots in the data ontology
   */
  values: DataType[];
}

/** Interface for a tool */
interface Tool {
  /** The displayed text */
  label: string;
  /** The identifier */
  type: string;
  id: string;
}

/**
 * The possible options for the parameter type
 *
 * To add more options, add more enum values
 */
enum ParameterType {
  /** Data type */
  Data = 'data',
  /** Tool type */
  Tool = 'tool',
}

/** Interface for the constraint type */
interface ConstraintType {
  /** This is a fake entry, it's needed for the autocomplete */
  [x: string]: any;
  /** The displayed text */
  description: string;
  /** The parameter types (i.e. data or tool) */
  parameterTypes: ParameterType[];
  /** The unique identifier */
  id: string;
}

/** Interface for a constraint */
interface Constraint {
  /** The constraint type */
  constraintType: ConstraintType;
  /** The parameters. The type should suffice with {@link ConstraintType.parameterTypes} */
  parameters: (Data | Tool)[];
}

/**
 * Interface for the run options / run parameters
 */
interface RunOptions {
  /** The ID of the run options. */
  id: string;
  /** The maximum run time of the query. */
  maxDuration: number;
  /** The (maximum) number of solutions. */
  solutions: number;
  /** The minimal length of a solution. */
  minLength: number;
  /** The maximum length of a solution. */
  maxLength: number;
}

export type { Ontology, OntologyNode, DataType,
  ConstraintType, RunOptions, Data, Tool, Constraint };
export { ParameterType };
