/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/**
 * Interface for a workflow diff structure
 */
interface WorkflowDifference {
  /** A dictionary of key: label of a tool, value: How much it's used more than the reference */
  extra: {},
  /** A dictionary of key: label of a tool, value: How much it's used less than the reference */
  missing: {}
}

export default WorkflowDifference;
