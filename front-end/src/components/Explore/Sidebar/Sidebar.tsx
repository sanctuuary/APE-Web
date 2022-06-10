/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Checkbox, Dropdown, Layout, Menu, message } from 'antd';
import { DownloadOutlined, DownOutlined } from '@ant-design/icons';
import WorkflowData from '@models/workflow/WorkflowVisualizerData';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import SidebarItem from './SidebarItem';
import styles from './Sidebar.module.less';

/**
 * The state of the sidebar component
 */
interface SidebarState {
  /**
   * The indices/values of the selected checkboxes
   */
  checkedList: CheckboxValueType[];
  /**
   * Disabled is an array of which checkboxes are disabled, on index
   */
}

/**
 * The props of the sidebar component
 */
interface SidebarProps {
  /**
   * Workflows is a list of all workflow data, that are the results
   * obtained when run is pressed.
   */
  workflows: WorkflowData[];
  /**
   * Function to pass selected workflows in the sidebar to the parent component
   */
  onSelect: (checkedList: number[]) => void;
}

/**
 * The sidebar for the explore page.
 *
 * This component allows selecting the resulting workflows
 * and showing them side-by-side on the explore page.
 *
 * Each workflow it is given will be displayed in its own {@link SidebarItem}.
 * A SideBarItem shows information about the workflow and allows selecting the workflow.
 * When a workflow is selected or deselected,
 * the `onSelect` function is triggered, notifying the {@link Explore} component.
 */
class Sidebar extends React.Component<SidebarProps, SidebarState> {
  constructor(props: SidebarProps) {
    super(props);
    const selectedWorkflows = props.workflows.length > 1 ? [0, 1] : [0];
    this.state = {
      checkedList: selectedWorkflows,
    };
    /** Automatically select the first workflow. */
    props.onSelect(selectedWorkflows);
  }

  /**
   * @param checkedList List of checked items (on index) in the sidebar
   */
  onChange = (checkedList) => {
    const { onSelect } = this.props;
    this.setState({
      checkedList,
    });
    onSelect(checkedList);
  };

  /**
   * Define the download dropdown menu.
   */
  downloadMenu = () => (
    <Menu onClick={this.downloadSelectedWorkflows}>
      <Menu.Item key="bash" icon={<DownloadOutlined />}>Bash</Menu.Item>
      <Menu.Item key="cwl" icon={<DownloadOutlined />}>Abstract CWL</Menu.Item>
      <Menu.Item key="png" icon={<DownloadOutlined />}>PNG</Menu.Item>
    </Menu>
  );

  /**
   * Downloads the selected workflows
   * @param event: The key of the item clicked on.
   */
  downloadSelectedWorkflows = async (event) => {
    const { checkedList } = this.state;

    if (checkedList.length === 0) {
      message.warning('No workflows selected. Please select a workflow and try again.');
      return;
    }

    const type = event.key;
    if (!['bash', 'cwl', 'png'].includes(type)) {
      return;
    }

    const dataString = checkedList.join(',');
    let endpoint: string = null;
    if (type === 'cwl') {
      endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/cwl/abstract/${dataString}`;
    } else {
      endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/${type}/${dataString}`;
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
        a.download = 'workflows.zip'.replace(' ', '_');
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
  };

  /**
   * Make a sidebar item for every workflow.
   * @returns a list of sidebar items to be rendered.
   */
  sidebarItems = () => {
    const { workflows } = this.props;
    return workflows.map((elem, i) => {
      const key = `workflow${i}`;
      return (
        <SidebarItem
          key={key}
          workflow={elem}
          index={i}
        />
      );
    });
  };

  render() {
    const { checkedList } = this.state;
    return (
      <div>
        <Dropdown overlay={this.downloadMenu}>
          <Button style={{ margin: '10px 10px 10px 30px' }}>
            Download selected<DownOutlined />
          </Button>
        </Dropdown>
        <Layout.Sider id={styles.Sidebar}>
          <Checkbox.Group
            className={styles['Sidebar-group']}
            onChange={this.onChange}
            value={checkedList}
          >
            {this.sidebarItems()}
          </Checkbox.Group>
        </Layout.Sider>
      </div>

    );
  }
}

export default Sidebar;
