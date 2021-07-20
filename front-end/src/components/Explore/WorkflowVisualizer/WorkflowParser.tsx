/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import { Elements, Node } from 'react-flow-renderer';
import WorkflowDifference from '@models/workflow/WorkflowDifference';
import WorkflowData, { WorkflowTool, WorkflowIO } from '@models/workflow/WorkflowVisualizerData';
import WorkflowEdge from './Edges/WorkflowEdge';

/** The vertical distance between nodes */
const levelYDistance = 75;
/** The horizontal distance between nodes */
const levelXDistance = 150;

/**
 * Return the node type for a tool.
 * @param tool The tool who's type is needed.
 * @returns A string representing the node type of this tool.
 */
function parseType(tool: Readonly<WorkflowTool>): string {
  const { inputTypes, outputTypes } = tool;
  if (inputTypes.length > 0 && outputTypes.length > 0) {
    return 'toolNode';
  }
  if (outputTypes.length > 0) {
    return 'inputNode';
  }
  return 'outputNode';
}

/**
 * Make a tool node for the given tool.
 * @param tool The current tool we want to make a node of.
 * @param order The order of which this tool appeared in the initial tool list
 * @param parentY parent node's y position
 * @param extra Boolean to indicate that the element is not used in the reference
 */
function dataElement(tool: WorkflowTool, order: number, parentY: number = 0, extra: boolean) {
  return {
    id: tool.id,
    type: parseType(tool),
    data: { label: tool.label, extra },
    position: {
      x: levelXDistance * (order - 1),
      y: levelYDistance + parentY,
    },
  };
}

/**
 * Make a flow element of the input or output type of a tool.
 * @param name Name of the workflow tool we're making the type element for
 * @param data Input or output for the workflow tool
 * @param level tree depth level
 * @param parentPos the pos of this type's input node.
 * when we have the same tool multiple times
 */
function typeElement(ioType: WorkflowIO, order: number, parentPos: { x: number; y: number; }) {
  return {
    id: ioType.id,
    type: 'dataTypeNode',
    data: { label: ioType.label },
    position: {
      x: parentPos.x + levelXDistance * (order - 1),
      y: parentPos.y + levelYDistance,
    },
  };
}

/**
 * Create an IONode and its edge to the parent.
 * @param parentId Id of the parent node
 * @param type input/output type of the current node
 * @param order order which the node appeared in, in the initial list
 * @param parentPos position of the parent node
 */
function IONode(
  parentId: string,
  type: WorkflowIO,
  order: number,
  parentPos: { x: number; y: number; },
) {
  if (type.label !== '') {
    return [
      WorkflowEdge(
        `e_${parentId}-${type.id}`,
        `out ${order}`,
        `${parentId}`,
        `${type.id}`,
        'in',
      ),
      typeElement(type, order, parentPos),
    ];
  }
  return [];
}

/**
 * Create a tool node and its edges.
 * @param tool Current tool we want to make a node of
 * @param order order of which this tool appeared in the initial list
 * @param parentY parent node's y position.
 * @param extra Boolean to indicate if a tool is not used in reference.
 */
function ToolNode(tool: WorkflowTool, order: number, parentY: number, extra: boolean) {
  const { inputTypes, outputTypes } = tool;
  const elements = [];

  const parent = dataElement(tool, order, parentY, extra);
  elements.push(parent);
  if (inputTypes.length > 0) {
    inputTypes.forEach((type, i) => {
      elements.push(WorkflowEdge(
        `e_${type.id}-${tool.id}`,
        `in ${i + 1}`,
        type.id,
        tool.id,
        'in',
      ));
    });
  }

  const { position } = parent;
  if (outputTypes.length > 0) {
    outputTypes.forEach((type, i) => {
      elements.push(...IONode(tool.id, type, i + 1, position));
    });
  }

  return elements;
}

/**
 * Serializes the workflow data from APE and return it as data readonly by React Flow.
 * @param data The WorkflowData from APE.
 * @param difference The difference between the workflow and the reference workflow.
 * @return The elements for React Flow to render.
 */
export default function WorkflowParser(
  data: WorkflowData,
  difference: WorkflowDifference,
): Elements {
  // Generate the basis: the second-to-last node and the output node

  const { inputTypeStates, outputTypeStates, tools } = data;
  const { extra } = difference;

  const graph: Elements = [];

  // The workflow input node
  const inputNode = {
    id: 'input',
    type: 'inputNode',
    data: { label: 'Workflow input' },
    position: {
      x: 0,
      y: 0,
    },
  };
  graph.push(inputNode);

  /*
   * Build the input type nodes and connect them to the workflow input.
   */
  inputTypeStates.forEach((type, i) => {
    graph.push(...IONode(inputNode.id, type, i + 1, inputNode.position));
  });

  /*
   * Build the tool nodes and connect them to their corresponding input type nodes.
   * We also keep track of the highest y position, so we know where to place the next nodes.
   */
  let outputY = 0;
  let order = 1;
  const extraCopy = extra;
  tools.forEach((tool: WorkflowTool) => {
    let y = levelYDistance;
    /*
     * Foreach tool's input type, check their y position in the current graph
     * and generate the tool node at the correct y-position.
     */
    tool.inputTypes.forEach((type) => {
      for (let j = 0; j < graph.length; j += 1) {
        const elem = graph[j];
        if (elem.id === type.id) {
          y = Math.max(y, (elem as Node).position.y);
          break;
        }
      }
    });
    if (y > outputY) {
      order = 1;
      outputY = y;
    } else {
      order += 1;
    }
    if (extraCopy[tool.label] > 0) {
      graph.push(...ToolNode(tool, order, y, true));
      extraCopy[tool.label] -= 1;
    } else {
      graph.push(...ToolNode(tool, order, y, false));
    }
  });

  // The workflow output node.
  const outputNode = {
    id: 'output',
    type: 'outputNode',
    data: { label: 'Workflow output' },
    position: {
      x: inputNode.position.x,
      y: 3 * levelYDistance + outputY,
    },
  };
  graph.push(outputNode);

  // Connect all output types with the workflow output
  outputTypeStates.forEach((type, i) => {
    graph.push(WorkflowEdge(
      `e_${type.id}-${outputNode.id}`,
      (i + 1).toString(),
      type.id,
      outputNode.id,
      'in',
    ));
  });

  return graph;
}
