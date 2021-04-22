/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/** Interface for a config.json file */
interface Config {
  /** The local path of the ontology */
  ontology_path: string;
  /** The url of the ontology prefix */
  ontologyPrexifIRI: string;
  /** The root of the tools taxonomy */
  toolsTaxonomyRoot: string;
  /** The roots of the data taxonomy */
  dataDimensionsTaxonomyRoots: string[];
  /** The local path of the tools annotations file */
  tool_annotations_path: string;
  /** The local path of the constraints.json configuration file */
  constraints_path: string;
  /** Whether or not the query should share memory */
  shared_memory: string;
  /** The local path where solutions must be stored */
  solutions_dir_path: string;
  /** The length properties of the solutions */
  solution_length: SolutionLength;
  /** The number of max solutions to be generated */
  max_solutions: string;
  /** The number of execution scripts to be created */
  number_of_execution_scripts: string;
  /** The number of graphs to be generated */
  number_of_generated_graphs: string;
  /** Whether or not tool sequences are allowed to be repeated */
  tool_seq_repeat: string;
  /** The input data */
  inputs: {};
  /** The output data */
  outputs: {};
  /** Enables/disables debug mode */
  debug_mode: string;
  /** Determines which inputs should be used */
  use_workflow_input: string;
  /** Determine if all generated data should be used */
  use_all_generated_data: string;
  /** Maximum duration of the query (in seconds) */
  timeout_sec: string;
}

/** Interface of the solution lengths */
interface SolutionLength {
  /** The maximum number of solutions to be generated */
  max: number;
  /** The minimum number of solutions to be generated */
  min: number;
}

export type { Config, SolutionLength };
