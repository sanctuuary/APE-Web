/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/** The interface of a constraints.json configuration file */
interface ConstraintsConfig {
  /** The constraints to be included */
  constraints: Constraint[];
}

/** The interface of a constraint */
interface Constraint {
  /** The id of the constraint to use */
  constraintid: string;
  /** The parameters to use for the constraint */
  parameters: {}[];
}

export type { ConstraintsConfig, Constraint };
