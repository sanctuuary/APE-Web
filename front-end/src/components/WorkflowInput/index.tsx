/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences
 */

/**
 * # WorkflowInput components
 *
 * These are the components on the explore page related to
 * configuring the input/output and running APE.
 *
 * WorkflowInput is the top-level component: it combines all other components.
 * It uses two InOutBoxes to give the user input fields for defining the workflow input and output.
 * A ConstraintBox gives the user a way to define constraints.
 * WorkflowRun contains the run parameter input and the run button.
 *
 * When the input, output, constraints,
 * or run parameters change; the state of WorkflowInput is changed to contain the update data.
 *
 * ## Running APE
 *
 * When the run button is pressed, the event bubbles up from WorkflowRun to WorkflowInput.
 * WorkflowInput contains its own `onRun` function which then packages the configuration
 * and sends it in a post request to the back-end.
 * When a response is returned,
 * it bubbles the worfklow results up to the explore page using the `onRun` function.
 * A continuation of the actions performed on run can be found in the section on the explore page.
 *
 * @packageDocumentation
 * @module Components/WorkflowInput
 */
export {};
