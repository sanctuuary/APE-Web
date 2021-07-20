/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/*
 * This file contains the type definitions for the Workflow visualization component
 */

/**
 * All the data for a workflow
 */
export default interface WorkflowData {
  /** The id of the workflow */
  id: number,
  /** The input types of the workflow */
  inputTypeStates: WorkflowIO[]
  /** The output types of the workflow */
  outputTypeStates: WorkflowIO[],
  /** The tools used in the workflow */
  tools: WorkflowTool[],
}

/**
 * Workflow tool type
 */
export interface WorkflowTool {
  /** Unique id for the tool */
  id: string,
  /** Tool name */
  label: string,
  /** The input type(s) and format(s) of the tool */
  inputTypes: WorkflowIO[],
  /** The output type and format of the tool */
  outputTypes: WorkflowIO[],
}

/**
 * Workflow input/output type
 */
export interface WorkflowIO {
  /** Unique identifier of the input/output */
  id: string,
  /** Name of the input/output */
  label: string,
}

export type NodeID = string;
/**
 * A map from one node's ID to other node IDs.
 * For example, from a node to its children.
 */
export type EdgeMap = Record<NodeID, NodeID[]>;
