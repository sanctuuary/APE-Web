/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Layout } from 'antd';
import ReactFlow, { ArrowHeadType, Edge, FlowElement, Node } from 'react-flow-renderer';
import { Ontology, Tool } from '@models/workflow/Workflow';
import CustomNode from '@components/WorkflowInput/ConstraintSketcher/CustomNode';
import Sidebar from '@components/WorkflowInput/ConstraintSketcher/Sidebar';
import styles from './ConstraintSketcher.module.less';

/**
 * The sketch interface. Contains a list of tools used in the sketch.
 */
export interface Sketch {
  /** List of tools. Needs to be in the order of which the tools are displayed. */
  tools: Tool[];
}

/** Props interface for {@link ConstraintSketcher} */
interface ConstraintSketcherProps {
  /** The tool ontology, used for the OntologyTreeSelect */
  toolOntology: Ontology;
  /** The onChange function */
  onChange: (sketch: Sketch) => void;
  /** The onClose function, with optional constraints */
  onSubmit: (save: boolean) => void;
  /** The current sketch */
  sketch: Sketch;
  /** Default Tool */
  defaultTool: () => Tool;
  /** Check whether the sketch has been opened. If so, reinstantiate */
  sketchOpened: boolean;
  /** Set functdion for the sketchOpened */
  setSketchOpened: (sketchOpened: boolean) => void;
}

/** State interface for {@link ConstraintSketcher} */
interface ConstraintSketcherState {
  /** The list of nodes */
  nodes: Node[];
  /** The list of edges */
  edges: Edge[];
  /** The node counter, used for generating unique node id's */
  nodeCounter: number;
  /** The edge counter, used for generating unique edge id's */
  edgeCounter: number;
}

/**
 * Constraint sketcher component. Includes a canvas for sketching,
 * a list to append items from and a field where the sketch gets
 * translated and buttons for confirmation.
 */
class ConstraintSketcher extends React.Component<ConstraintSketcherProps, ConstraintSketcherState> {
  constructor(props: ConstraintSketcherProps) {
    super(props);

    const { sketch } = this.props;

    this.state = this.initiateState(sketch);
  }

  /** Check whether the sketch has been overwritten by opening another sketch */
  componentDidUpdate() {
    const { sketch, sketchOpened, setSketchOpened } = this.props;
    if (sketchOpened) {
      setSketchOpened(false);
      // Reason for ignoring the rule: https://github.com/airbnb/javascript/issues/1875.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(this.initiateState(sketch));
    }
  }

  /**
   * Convert the sketch into nodes and edges and and return it as a {@link ConstraintSketcherState}
   * @param sketch - the sketch that will be converted
   */
  initiateState = (sketch: Sketch): ConstraintSketcherState => {
    const nodes: Node[] = this.redistribute([
      {
        id: 'start',
        type: 'input',
        data: {
          label: <>INPUT</>,
        },
        position: { x: 0, y: 0 },
        style: {
          width: '100%',
          backgroundColor: '#f48270',
          height: '40px',
          borderStyle: 'none',
          borderRadius: 0,
          cursor: 'auto',
        },
      },
      ...sketch.tools.map((tool, index) => this.newNode(tool, index)),
      {
        id: 'end',
        type: 'output',
        data: {
          label: <>OUTPUT</>,
        },
        position: { x: 0, y: 560 },
        style: {
          width: '100%',
          backgroundColor: '#f48270',
          height: '40px',
          borderStyle: 'none',
          borderRadius: 0,
          cursor: 'auto',
        },
      },
    ]);

    const edges: Edge[] = [];

    for (let index = 0; index < nodes.length - 1; index += 1) {
      edges.push(this.newEdge(nodes[index].id, nodes[index + 1].id, index));
    }

    const nodeCounter = sketch.tools.length;
    const edgeCounter = edges.length;

    return { nodes, edges, nodeCounter, edgeCounter };
  };

  /**
   * Get the current value of the node counter and increase it.
   * @param increment - The value by how much the counter should be incremented.
   * React doesn't let you set a value in the state and get it in the same render cycle,
   * so you have to define by how much you want to increase the counter.
   * @return The current value of the counter.
   */
  getNextNodeCount = (increment: number = 1): number => {
    const { nodeCounter } = this.state;
    this.setState({ nodeCounter: nodeCounter + increment });
    return nodeCounter;
  };

  /**
   * Get the current value of the edge counter and increase it.
   * @param increment - The value by how much the counter should be incremented.
   * React doesn't let you set a value in the state and get it in the same render cycle,
   * so you have to define by how much you want to increase the counter.
   * @return The current value of the counter.
   */
  getNextEdgeCount = (increment: number = 1): number => {
    const { edgeCounter } = this.state;
    this.setState({ edgeCounter: edgeCounter + increment });
    return edgeCounter;
  };

  /**
   * Create a new node
   * @param tool - the value of the node
   * @param count - the current count of the counter
   * @return - a new node
   */
  newNode = (tool?: Tool, count: number = this.getNextNodeCount()): Node => {
    const { toolOntology } = this.props;

    return ({
      id: `node${count}`,
      type: 'custom',
      data: {
        toolOntology,
        tool,
        onChange: this.onValueChange,
        onRemove: this.onRemove,
      },
      position: {
        x: 175,
        y: 0,
      },
    });
  };

  /**
   * Create a new edge
   * @param source - the id of the source node
   * @param target - the id of the target node
   * @param count - the current count of the counter
   * @return - a new edge
   */
  newEdge = (source: string, target: string, count: number = this.getNextEdgeCount()): Edge => ({
    id: `edge${count}`,
    source,
    target,
    label: '+',
    /*
     * I couldn't find a better way to get the styling of the edge in. First I used
     * CustomEdge, but I couldn't figure out how to get the label centered.
     */
    labelBgPadding: [10, 6],
    labelBgBorderRadius: 20,
    style: {
      stroke: '#212529',
      strokeDasharray: '5 5',
    },
    labelBgStyle: {
      fill: '#dddddd',
    },
    labelStyle: {
      borderRadius: '5px',
      width: '10px',
      height: '10px',
      textAlign: 'center',
      fontSize: '14px',
    },
    arrowHeadType: ArrowHeadType.Arrow,
  });

  /**
   * The onClick function for elements in ReactFlow. See if the element is an edge
   * and if so, execute the onAdd function.
   * @param event - the click event object
   * @param element - the element that has been clicked
   */
  onElementClick = (event: React.MouseEvent<Element, MouseEvent>, element: FlowElement): void => {
    if (element.id.startsWith('edge')) {
      // The element is an edge
      this.onAdd(element.id);
    }
  };

  /**
   * Add a new node on an edge and connect it to the previous source and target.
   * @param edgeID - The id of the edge.
   */
  onAdd = (edgeID: string): void => {
    const { onChange, sketch, defaultTool } = this.props;
    const { nodes, edges } = this.state;

    const index = edges.findIndex(({ id }) => id === edgeID);
    const edge = edges[index];

    const node = this.newNode(defaultTool());

    // Insert the node at the index of the right place
    nodes.splice(index + 1, 0, node);
    sketch.tools.splice(index, 0, defaultTool());

    const edgeCount = this.getNextEdgeCount(2);

    // Create new edges towards the new node and from the new node to the old target
    const targetEdge = this.newEdge(edge.source, node.id, edgeCount);
    const sourceEdge = this.newEdge(node.id, edge.target, edgeCount + 1);

    // Remove the old edge and insert the new edges
    edges.splice(index, 1, targetEdge, sourceEdge);

    this.setState({ nodes: this.redistribute(nodes), edges });
    onChange(sketch);
  };

  /**
   * Change the tool value of a node.
   * @param nodeID - The id of the node which values needs to be changed.
   * @param value - the new tool value.
   */
  onValueChange = (nodeID: string, value: Tool) => {
    const { onChange, sketch } = this.props;
    const { nodes } = this.state;

    const index = nodes.findIndex(({ id }) => id === nodeID);

    // Set the value correctly in the sketch and in the node
    nodes[index].data.tool = value;
    sketch.tools[index - 1] = value;

    this.setState({ nodes });
    onChange(sketch);
  };

  /**
   * Remove the node with the given nodeID and connect the old edges to each other.
   * @param nodeID - The id of the node to remove.
   */
  onRemove = (nodeID: string): void => {
    const { onChange, sketch } = this.props;
    const { edges, nodes } = this.state;

    const index = nodes.findIndex(({ id }) => id === nodeID);

    // Remove the node and the corresponding tool in the sketch
    nodes.splice(index, 1);
    sketch.tools.splice(index - 1, 1);

    // Find the edges that were connected to the node
    const targetEdge = edges.find(({ target }) => target === nodeID);
    const sourceEdge = edges.find(({ source }) => source === nodeID);

    // Remove the edges and insert a new edge from the previous node to the next node
    edges.splice(index - 1, 2, this.newEdge(targetEdge.source, sourceEdge.target));

    this.setState({ nodes: this.redistribute(nodes), edges });
    onChange(sketch);
  };

  /**
   * Redistribute the node list, so it is evenly spread over the whole vertical range.
   * @param nodes - The list of nodes
   * @return - The redistributed list of nodes
   */
  redistribute = (nodes: Node[]): Node[] => {
    const factor = 560 / (nodes.length - 1);

    return nodes.map((node, index) => (
      { ...node, position: { x: node.position.x, y: index * factor } }
    ));
  };

  render() {
    const { onSubmit, sketch } = this.props;
    const { edges, nodes } = this.state;

    const nodeTypes = {
      custom: CustomNode,
    };

    return (
      <Layout id={styles.ConstraintSketcher}>
        <Layout.Content id={styles.Sketch}>
          <ReactFlow
            data-testid="SketchCanvas"
            style={{ height: 600, width: 600 }}
            elements={[...nodes, ...edges]}
            nodeTypes={nodeTypes}
            onElementClick={this.onElementClick}
            paneMoveable={false}
            zoomOnScroll={false}
            zoomOnDoubleClick={false}
            nodesConnectable={false}
            nodesDraggable={false}
          />
        </Layout.Content>
        <Layout.Sider id={styles.Sidebar}>
          <Sidebar
            sketch={sketch}
            onSubmit={onSubmit}
          />
        </Layout.Sider>
      </Layout>
    );
  }
}

export default ConstraintSketcher;
