/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Edge } from 'react-flow-renderer';

/**
 * Default edge settings for all Workflow edges for the {@link WorkflowVisualizer}.
 *
 * @param id The id for the edge
 * @param label The label for the edge
 * @param source The source node of the edge
 * @param target The target node of the edge
 * @param targetHandle The target's handle to connect to
 * @returns The generated React Flow edge.
 */
function WorkflowEdge(
  id: string,
  label: string,
  source: string,
  target: string,
  targetHandle: string,
): Edge {
  return {
    id,
    type: 'smoothstep',
    source,
    target,
    targetHandle,
    animated: false,
    label,
  };
}

export default WorkflowEdge;
