/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Card, Popover, Dropdown, Menu, Space } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import ReferenceCompare from '@components/Compare/ReferenceCompare';
import ReactFlow, { Elements, OnLoadParams, ReactFlowProvider, Controls } from 'react-flow-renderer';
import WorkflowDifference from '@models/workflow/WorkflowDifference';
import WorkflowData, { WorkflowTool } from '@models/workflow/WorkflowVisualizerData';
import InputNode from './Nodes/InputNode';
import OutputNode from './Nodes/OutputNode';
import ToolNode from './Nodes/ToolNode';
import DataTypeNode from './Nodes/DataTypeNode';
import WorkflowSerializer from './WorkflowSerializer';
import styles from './Workflow.module.less';

/**
 * Custom node types.
 *
 * They are defined in the `Nodes` directory.
 */
const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  toolNode: ToolNode,
  dataTypeNode: DataTypeNode,
};

/** The props for the {@link WorkflowVisualizer} component */
interface WorkflowVisualizerProps {
  /** The name of the workflow */
  name: string,
  /** The data to render */
  data: WorkflowData,
  /** Indicated whether the workflow is the reference */
  isReference: boolean,
  /** The reference workflow */
  referenceWorkflow: WorkflowData,
  /** Function to set this workflow as reference */
  setReference: (workflowData: WorkflowData) => void,
}

/**
 * The state for the {@link WorkflowVisualizer} component
 */
interface WorkflowVisualizerState {
  hovering: boolean
}

/**
 * The component for visualizing APE workflows.
 *
 * When WorkflowVisualizer is initiated, it passes the elements to {@link WorkflowParser}.
 * WorkflowParser restructures the data from APE to
 * a structure which the React Flow library uses to render graphs.
 *
 * Custom node and edge types are used to define the look of the graphs.
 * These nodes and edges are defined in the `Edges` and `Nodes` directories.
 */
class WorkflowVisualizer extends React.Component<WorkflowVisualizerProps, WorkflowVisualizerState> {
  elements: Elements;

  serializer: WorkflowSerializer;

  /**
   * Constructor
   * @param props The props for the Workflow component.
   */
  constructor(props: Readonly<WorkflowVisualizerProps>) {
    super(props);
    this.state = {
      hovering: false,
    };

    const { data } = props;
    this.serializer = new WorkflowSerializer(data);
  }

  /**
   * Fit the graph inside the given space.
   */
  onLoad = (reactFLowInstance: OnLoadParams) => reactFLowInstance.fitView();

  /**
   * Handles the 'make reference' button click.
   */
  onClick = () => {
    const { data, setReference, isReference } = this.props;
    if (isReference) {
      setReference(undefined);
    } else {
      setReference(data);
    }
  };

  /**
   * Gets all tools used by the compare workflow, but not used by the local reference workflow
   * @param compare The workflow being compared
   * @param reference The reference workflow
   */
  getToolsNotUsedBySide = (compare: WorkflowData, reference: WorkflowData) => {
    const result: WorkflowTool[] = [];
    compare.tools.forEach((compareTool) => {
      let isUsed = false;
      reference.tools.forEach((referenceTool: WorkflowTool) => {
        if (compareTool.label === referenceTool.label) {
          isUsed = true;
        }
      });
      if (!isUsed) {
        result.push(compareTool);
      }
    });
    return result;
  };

  /**
   * Counts how many times a tool is used in a given list of tools
   * @param tools A list of tools
   */
  getToolUsageCount = (tools: WorkflowTool[]) => {
    const result = {};
    tools.forEach((tool) => {
      if (result[tool.label] === undefined) {
        result[tool.label] = 1;
      } else {
        result[tool.label] += 1;
      }
    });

    return result;
  };

  /**
   * Sets the state for mouse hovering on the workflow
   */
  handleHoverOn = () => {
    this.setState({ hovering: true });
  };

  /**
   * Sets the state for mouse hovering off the workflow
   */
  handleHoverOff = () => {
    this.setState({ hovering: false });
  };

  /**
   * Renders the workflow diff popover
   */
  renderCompareWindow = () => (
    <ReferenceCompare
      difference={this.getToolDiff()}
    />
  );

  /**
   * Gets the tool diff of a this workflow and reference
   * @return a WorkflowDifference with the diff between this workflow and the reference
   */
  getToolDiff = (): WorkflowDifference => {
    const { data, referenceWorkflow } = this.props;
    const result: WorkflowDifference = { extra: {}, missing: {} };
    if (referenceWorkflow === undefined) { return result; }

    result.extra = this.getToolUsageCount(this.getToolsNotUsedBySide(data, referenceWorkflow));
    result.missing = this.getToolUsageCount(this.getToolsNotUsedBySide(referenceWorkflow, data));

    return result;
  };

  /**
   * Handle the click on a download button: download the file.
   * @param e The click event
   */
  handleDownloadClick = async (e) => {
    const { name, data } = this.props;
    const type: string = e.key;
    let endpoint: string;
    let extension: string;

    // Determine type
    switch (type) {
      case 'bash':
        endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/bash/${data.id}`;
        extension = 'sh';
        break;
      case 'cwl':
        endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/cwl/abstract/${data.id}`;
        extension = 'cwl';
        break;
      case 'png':
        endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/png/${data.id}`;
        extension = 'png';
        break;
      default:
        // eslint-disable-next-line no-console
        console.error(`Unknown download type: ${type}.`);
        return;
    }

    // Download the file
    await fetch(endpoint, {
      method: 'GET',
      credentials: 'include',
    })
      // Get file data
      .then((res) => res.blob())
      // Download file data
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        // Define file name (Workflow_id.extension)
        a.download = `${name}.${extension}`.replace(' ', '_');
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  /**
   * Define the download dropdown menu.
   */
  downloadMenu = () => {
    const items = [
      { key: 'bash', icon: <DownloadOutlined />, label: 'Bash' },
      { key: 'cwl', icon: <DownloadOutlined />, label: 'Abstract CWL' },
      { key: 'png', icon: <DownloadOutlined />, label: 'PNG' },
    ];

    return <Menu items={items} onClick={this.handleDownloadClick} />;
  };

  render() {
    const { name, isReference, referenceWorkflow } = this.props;
    const { hovering } = this.state;
    this.elements = this.serializer.getReactFlowData(this.getToolDiff());

    let cardTitle = name;
    let cardClass = styles.workflow;
    if (isReference) {
      cardClass += ` ${styles.reference}`;
      cardTitle += ' (Reference)';
    }

    const buttonText = isReference ? 'Remove Reference' : 'Make Reference';
    const buttonType = isReference ? 'default' : 'primary';

    return (
      <Popover title="Difference from reference" content={this.renderCompareWindow()} visible={hovering && !isReference && referenceWorkflow !== undefined} placement="right">
        <Card
          title={cardTitle}
          data-testid={name}
          className={cardClass}
          extra={(
            <Space>
              <Dropdown overlay={this.downloadMenu}>
                <Button>
                  Download <DownOutlined />
                </Button>
              </Dropdown>
              <Button
                type={buttonType}
                onClick={this.onClick}
              >{buttonText}
              </Button>
            </Space>
          )}
          onMouseEnter={this.handleHoverOn}
          onMouseLeave={this.handleHoverOff}
        >
          <div
            style={{
              height: 'calc(90vh - 148px)',
            }} // A height is required for ReactFlow to render
          >
            <ReactFlowProvider>
              <ReactFlow
                elements={this.elements}
                onLoad={this.onLoad}
                nodeTypes={nodeTypes}
                paneMoveable={true}
                zoomOnScroll={true}
                nodesDraggable={true}
                // Graph should not be edited by user, disable editing
                nodesConnectable={false}
                elementsSelectable={false}
              >
                <Controls
                  showInteractive={false}
                />
              </ReactFlow>
            </ReactFlowProvider>
          </div>
        </Card>
      </Popover>
    );
  }
}

export default WorkflowVisualizer;
