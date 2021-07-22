import { Elements } from 'react-flow-renderer';
import WorkflowData, { EdgeMap, NodeID, WorkflowIO, WorkflowTool } from '@models/workflow/WorkflowVisualizerData';
import WorkflowDifference from '@models/workflow/WorkflowDifference';
import WorkflowEdge from './Edges/WorkflowEdge';
import TopologicalSort from './TopologicalSort';

/** The ID for the workflow input node. */
const inputNodeID = 'input';
/** The ID for the workflow output node. */
const outputNodeID = 'output';

/** The vertical distance between nodes. */
const yDistance = 75;
/** The horizontal distance between nodes. */
const xDistance = 150;

/**
 * Map from a NodeID to the "max width" of the node.
 *
 * The "max width" is the number of children a node or one of its ancestor has.
 * The highest number one of them has is used.
 *
 * For example, a node A has two children, but one of these children has four children.
 * Therefore, the "max width" of node A is four.
 */
type MaxWidthMap = {
  [id: string]: number
};
/** Map from a NodeID to the position of the node. */
type PositionsMap = {
  [id: string]: { x: number, y: number }
};

/**
 * Class to structure {@link WorkflowData} in a way React Flow can render it.
 *
 * The structuring of workflow data to React Flow data happens in three phases:
 * - Pre-processing
 * - Generate position data.
 * - Generate render data.
 *
 * The generation of position data and render data is done separately
 * to make it easier to make changes to either of them.
 *
 * ## Pre-processing
 *
 * - An {@link EdgeMap} from nodes to their children is generated.
 * - A topologically sorted list of all nodes of the workflow is generated.
 * - An {@link EdgeMap} from nodes to their parents is generated.
 * - The {@link MaxWidthMap} is generated (see {@link generateMaxWidth} for more information).
 *
 * This is done in the constructor.
 *
 * ## Generate position data
 *
 * The positions of the nodes is determined.
 * This is done from bottom to top (the reverse topological order).
 * This way, the gaps between nodes is minimized.
 *
 * This is done in the {@link generateLocations} function.
 *
 * ## Generate render data
 *
 * The position data is combined with the workflow data.
 * The names and visual types of the nodes are added in this data.
 * The edges between nodes are also added to the React Flow Data.
 *
 * This is done in the {@link getReactFlowData} function.
 */
export default class WorkflowSerializer {
  /** The workflow solution data. */
  private workflowData: WorkflowData;

  /** An {@link EdgeMap} from nodes to their child nodes. */
  private childMap: EdgeMap;

  /**
   * The topologically ordered nodes in the workflow.
   *
   * This list does not include "dead ends":
   * type nodes that are the output of a tool node, but are not used as an input in another node.
   */
  private sorted: NodeID[];

  /** An {@link EdgeMap} from nodes to their parent nodes. */
  private parentsMap: EdgeMap;

  /** The {@link MaxWidthMap} for the workflow. */
  private widthMap: MaxWidthMap;

  /** The position data for the nodes. */
  private positions: PositionsMap = {};

  /**
   * WorkflowSerializer constructor.
   * @param data The data of the workflow.
   */
  constructor(data: WorkflowData) {
    this.workflowData = data;

    // Pre-processing
    const { nodes, childMap } = this.generateNodesAndChildMap();
    this.childMap = childMap;
    const sorter = new TopologicalSort(nodes.slice(), childMap);
    this.sorted = sorter.sort();

    this.parentsMap = this.generateParentsMap(this.sorted.slice());
    this.widthMap = this.generateMaxWidth(this.sorted.slice());

    // Generate position data
    this.generateLocations();
  }

  /**
   * Position all nodes of the to-be-rendered workflow.
   */
  private generateLocations() {
    const positions: PositionsMap = {};

    /**
     * Position the parent nodes of a given node.
     * @param node The ID of the node.
     * @param yPos The Y-position of the given node.
     */
    const placeParents = (node: NodeID, yPos: number) => {
      const parents: NodeID[] = this.parentsMap[node];
      const { x } = positions[node];

      // If the node has more than one parent, place them spaced apart
      if (parents.length > 1) {
        let width = 0;
        // Calculate the nodes that should be placed side-by-side above this node
        parents.forEach((parent) => {
          width += this.widthMap[parent];
        });
        // Position the parents
        let xParent = -(Math.floor(width / 2) * xDistance);
        let yOffset = 0.1 * yDistance * width;
        parents.forEach((parent, i) => {
          /*
           * Offset the nodes a bit from each other to make their edges not overlap.
           * Only offset the middle nodes.
           */
          if (i !== 0 && i !== parents.length - 1) {
            yOffset -= 0.1 * yDistance;
            positions[parent] = { x: xParent, y: yPos - yDistance - yOffset };
          } else {
            // Don't offset the leftmost and rightmost nodes
            positions[parent] = { x: xParent, y: yPos - yDistance };
          }

          xParent += this.widthMap[parent] * xDistance;
        });
      } else {
        // There is only one parent, place it right above the current node
        const parent = parents[0];
        positions[parent] = {
          x,
          y: yPos - yDistance,
        };
      }
    };

    // Add the workflow output node and output type nodes
    positions[outputNodeID] = { x: 0, y: 0 };
    placeParents(outputNodeID, 0);

    let highestY = -yDistance;
    const sorted = this.sorted.slice(); // Copy the node list
    sorted.pop(); // Remove the workflow output node, it has already been added to the graph
    sorted.reverse(); // Order from bottom to top

    /*
     * Add the tool nodes (in order from bottom to top).
     * The workflow input node is filtered out, because it is already positioned.
     */
    sorted.filter((n) => n !== inputNodeID).forEach((node: NodeID) => {
      // Get the node below this one to determine the Y-position
      let child: any;
      this.childMap[node].forEach((e: NodeID) => {
        if (child === undefined && positions[e] !== undefined) {
          child = positions[e];
        }
      });
      // Determine Y-position
      const yPos = positions[node].y;
      if (yPos < highestY) {
        highestY = yPos;
      }

      // Calculate parents' X-positions
      placeParents(node, yPos);
    });
    // Make sure the workflow input node is at the top of the graph
    positions[inputNodeID].y = highestY - yDistance;

    this.positions = positions;
  }

  /**
   * Generate the data for React Flow to render the workflow.
   * @param difference The difference between this workflow and the reference workflow.
   * @returns The workflow data as React Flow data which can be rendered.
   */
  getReactFlowData(difference: WorkflowDifference) {
    const graph: Elements = [];
    const { extra } = difference;
    const extraCopy = extra;

    // Add the workflow output node
    graph.push({
      id: outputNodeID,
      type: 'outputNode',
      data: { label: 'Workflow output' },
      position: {
        x: this.positions[outputNodeID].x,
        y: this.positions[outputNodeID].y,
      },
    });
    // Add edges to the output type nodes
    this.workflowData.outputTypeStates.forEach((output, i) => {
      graph.push(
        WorkflowEdge(
          `e_${output.id}-${outputNodeID}`,
          `in ${i + 1}`,
          output.id,
          outputNodeID,
          'in',
        ),
      );
    });

    const sorted = this.sorted.slice(); // Copy the node list.
    sorted.pop(); // Remove the workflow output node, it has already been added to the graph
    const nodes = sorted.reverse(); // Order from bottom to top
    // Filter out the Workflow input node, it will be added to the graph later
    nodes.filter((n) => n !== inputNodeID).forEach((node: NodeID) => {
      // Get this node's data
      let data: WorkflowTool | WorkflowIO = this.workflowData.tools.filter((t) => t.id === node)[0];
      // If the node is not a tool, but an input/output, search the output types
      if (data === undefined) {
        this.workflowData.tools.forEach((tool) => {
          tool.outputTypes.forEach((out) => {
            if (out.id === node) {
              data = out;
            }
          });
        });
      }

      if (data === undefined) {
        // Node is an input node
        const [first] = this.workflowData.inputTypeStates.filter((i) => i.id === node);
        data = first;
      }

      // Determine the type of the node
      let typeName: string;
      if ('inputTypes' in data) {
        if (data.inputTypes.length > 0) {
          typeName = 'toolNode';
        } else {
          typeName = 'inputNode';
        }
      } else {
        typeName = 'dataTypeNode';
      }

      // If this node does not exist in the reference workflow, flag it as "extra"
      let isExtra = false;
      if (extraCopy[data.label]) {
        isExtra = true;
        extraCopy[data.label] -= 1;
      }

      // Add the node to be rendered
      graph.push({
        id: data.id,
        type: typeName,
        data: { label: data.label, extra: isExtra },
        position: {
          x: this.positions[data.id].x,
          y: this.positions[data.id].y,
        },
      });

      // Check if data is a WorkflowTool
      if ('inputTypes' in data) {
        // Add the edges from the input data type node to this node
        data.inputTypes.forEach((inp, i) => {
          // Don't include dead ends
          if (!nodes.includes(inp.id)) {
            return;
          }
          // Add edge from the input type node to the tool node
          graph.push(
            WorkflowEdge(
              `e_${inp.id}-${data.id}`,
              `in ${i + 1}`,
              inp.id,
              data.id,
              'in',
            ),
          );
        });
        // Add the edges from this node to the output data type node
        data.outputTypes.forEach((out, i) => {
          // Don't include dead ends
          if (!nodes.includes(out.id)) {
            return;
          }
          // Add edge from the input/tool node to the data type node
          graph.push(
            WorkflowEdge(
              `e_${data.id}-${out.id}`,
              `out ${i + 1}`,
              data.id,
              out.id,
              'out',
            ),
          );
        });
      }
    });

    // Add the workflow input node
    graph.push({
      id: 'input',
      type: 'inputNode',
      data: { label: 'Workflow input' },
      position: {
        x: this.positions[inputNodeID].x,
        y: this.positions[inputNodeID].y,
      },
    });
    // Add edges to the input type nodes
    this.workflowData.inputTypeStates.forEach((input, i) => {
      graph.push(
        WorkflowEdge(
          `e_${inputNodeID}-${input.id}`,
          `out ${i + 1}`,
          inputNodeID,
          input.id,
          'out',
        ),
      );
    });

    return graph;
  }

  /**
   * Create a list of all nodes and an {@link EdgeMap}.
   * @returns A list of all nodes (from input to output) and a related {@link EdgeMap}.
   */
  private generateNodesAndChildMap() {
    const nodes: NodeID[] = [];
    const childMap: EdgeMap = {};

    // Create node list
    nodes.push(inputNodeID);
    this.workflowData.inputTypeStates.forEach((i) => nodes.push(i.id));
    this.workflowData.tools.forEach((tool) => {
      nodes.push(tool.id);
      tool.inputTypes.forEach((input) => {
        if (!nodes.includes(input.id)) {
          nodes.push(input.id);
        }
      });
    });
    this.workflowData.outputTypeStates.forEach((o) => nodes.push(o.id));
    nodes.push(outputNodeID);

    // Create edge map
    childMap[inputNodeID] = this.workflowData.inputTypeStates.map((i) => i.id);
    childMap[outputNodeID] = [];
    this.workflowData.tools.forEach((tool) => {
      // Don't include dead ends
      childMap[tool.id] = tool.outputTypes.filter((o) => nodes.includes(o.id)).map((o) => o.id);

      tool.inputTypes.forEach((input) => {
        // Don't include dead ends
        if (childMap[input.id] === undefined && nodes.includes(tool.id)) {
          childMap[input.id] = [tool.id];
        } else if (nodes.includes(tool.id)) {
          childMap[input.id].push(tool.id);
        }
      });
    });
    this.workflowData.outputTypeStates.forEach((output) => {
      childMap[output.id] = [outputNodeID];
    });

    return { nodes, childMap };
  }

  /**
   * Create a map from a node to their parents.
   * @param nodes All nodes in the workflow.
   * @returns An {@link EdgeMap} of all nodes to their parents.
   */
  private generateParentsMap(nodes: NodeID[]) {
    const parentsMap: EdgeMap = {};

    parentsMap[inputNodeID] = [];
    parentsMap[outputNodeID] = this.workflowData.outputTypeStates.map((o) => o.id);

    this.workflowData.inputTypeStates.forEach((input) => {
      parentsMap[input.id] = [inputNodeID];
    });

    // The order in which nodes should be added to the parent map
    const order = nodes.slice().reverse(); // Copy and sort from bottom to top
    this.workflowData.tools.forEach((tool) => {
      if (tool.inputTypes.length === 0) {
        // Tool has no parents
        parentsMap[tool.id] = [];
      } else {
        // Tool has parents
        order.forEach((node) => {
          if (tool.inputTypes.some((i) => i.id === node)) {
            if (parentsMap[tool.id] === undefined) {
              // Tool was not added before, add it
              parentsMap[tool.id] = [node];
            } else if (!parentsMap[tool.id].includes(node)) {
              // Tool was added before, append to its parents
              parentsMap[tool.id].push(node);
            }
          }
        });
      }

      // Types
      tool.outputTypes.filter((o) => nodes.includes(o.id)).forEach((o) => {
        parentsMap[o.id] = [tool.id];
      });
    });

    return parentsMap;
  }

  /**
   * Calculates the number of children a node or one of its ancestor has.
   * The highest is used ("max width").
   *
   * For example, a node A has two children, but one of these children has four children.
   * Therefore, the "max width" of node A is four.
   * @param nodes The nodes in the workflow.
   * @param parentsMap An {@link EdgeMap} of nodes to their parents.
   * @returns A map of all nodes to the number of children they have or their ancestors,
   * whichever is higher.
   */
  private generateMaxWidth(nodes: NodeID[]): MaxWidthMap {
    nodes.reverse();
    const maxWidth: MaxWidthMap = {};

    nodes.forEach((node) => {
      maxWidth[node] = this.maxWidth(node);
    });
    return maxWidth;
  }

  /**
   * Calculate the "max width" of a node.
   * @param node The node whose "max width" is being calculated.
   * @param parentsMap An {@link EdgeMap} from nodes to their parent nodes.
   * @returns The "max width" of the node.
   */
  private maxWidth(node: NodeID): number {
    // Base case, stop recursion
    if (this.parentsMap[node].length === 0) {
      return 1;
    }

    let width = 0;
    this.parentsMap[node].forEach((parent) => {
      width += this.maxWidth(parent);
    });
    return width;
  }
}
