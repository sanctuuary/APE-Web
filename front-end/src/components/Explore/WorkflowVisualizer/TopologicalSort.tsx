import { EdgeMap, NodeID } from '@models/workflow/WorkflowVisualizerData';

/**
 * Object to topologically sort given node IDs.
 */
export default class TopologicalSort {
  /** The unvisited nodes. */
  private unmarked: NodeID[];

  /** The visited nodes. */
  private sortedElements: NodeID[];

  /** Map from node to direct child nodes. */
  private edges: EdgeMap;

  /**
   * Constructor for TopologicalSort.
   * @param nodes The node IDs of the nodes to be sorted.
   * @param edges A map of nodes to their direct child nodes.
   */
  constructor(nodes: NodeID[], edges: EdgeMap) {
    this.unmarked = nodes.reverse();
    this.edges = edges;

    this.sortedElements = [];
  }

  /**
   * Topologically sort the nodes.
   * @returns A list of topologically sorted node IDs.
   */
  public sort(): NodeID[] {
    while (this.unmarked.length > 0) {
      const node = this.unmarked.pop();
      this.visit(node);
    }
    // List was constructed from bottom to top, reverse the list to get the topological order.
    return this.sortedElements.reverse();
  }

  private visit(node: NodeID) {
    // Check if node is already visited
    if (this.sortedElements.some((e) => e === node)) {
      return;
    }

    // Explore neighbors (DFS)
    this.edges[node].forEach((m: NodeID) => {
      this.visit(m);
    });

    this.sortedElements.push(node);
  }
}
