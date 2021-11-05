/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { NextRouter } from 'next/router';
import { Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Upload } from 'antd';
import { DownloadOutlined, InfoOutlined, UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { validateJSON, validateOWL, onFileChange, ReadMultipleFileContents, RMFCInput } from '@helpers/Files';
import Domain, { Topic, Visibility } from '@models/Domain';
import { constraintsModal, ontologyModal, runConfigModal, toolAnnotationsModal } from '@components/Domain/Domain';
import styles from './DomainEdit.module.less';

const { Option } = Select;

/**
 * Props for DomainEdit component.
 */
interface IProps {
  /** The domain to edit */
  domain: Domain,
  /** The topics that are available to choose from */
  topics: Topic[],
  /** Router used for redirecting after save or cancel */
  router: NextRouter,
}

/**
 * State of DomainEdit component
 */
interface IState {
  topicList: any[],
  /** The topics that are selected to use for this domain */
  appliedTopics: string[],
  /** Whether the topics have been changed and should be sent to the back-end */
  topicsChanged: boolean,
  /** Whether the domain already has a use case config file. */
  useCaseConfigExists: boolean,
  /** Whether the domain already has a use case constraints file. */
  useCaseConstraintsExists: boolean,
  /** Ontology file to upload */
  owlFiles: UploadFile<any>[],
  /** Tools annotations file to upload */
  toolsAnnotationsFiles: UploadFile<any>[],
  /** Run config file to upload */
  runConfigFiles: UploadFile<any>[],
  /** Constraint file to upload */
  constraintsFiles: UploadFile<any>[],
  /** Whether each of the tooltip modals are visible. */
  visibleModals: { [name: string]: boolean };
}

/**
 * Form for editing domains
 */
class DomainEdit extends React.Component<IProps, IState> {
  constructor(props: Readonly<IProps>) {
    super(props);

    const { domain, topics } = this.props;
    const topicList = topics.map((elem, i) => (
      <Option
        key={i.toString()}
        value={elem.id}
      >{elem.name}
      </Option>
    ));
    this.state = {
      topicList,
      /*
       * Only add the topics to the applied / selected list
       * if they are already associated with this domain.
       */
      appliedTopics: topics.filter((t) => domain.topics.includes(t.name)).map((t) => t.id),
      topicsChanged: false,
      useCaseConfigExists: false,
      useCaseConstraintsExists: false,
      owlFiles: [],
      toolsAnnotationsFiles: [],
      runConfigFiles: [],
      constraintsFiles: [],
      visibleModals: {
        ontology: false,
        tool_annotations: false,
        run_config: false,
        constraints: false,
      },
    };
  }

  async componentDidMount() {
    await this.checkUseCaseFiles();
  }

  /**
   * Checks if the use case config and use case constraints files exist in this domain.
   */
  checkUseCaseFiles = async () => {
    const { domain } = this.props;

    const endpointBase = `${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download`;
    await fetch(`${endpointBase}/usecase-config/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ useCaseConfigExists: true });
        }
      });

    await fetch(`${endpointBase}/usecase-constraints/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ useCaseConstraintsExists: true });
        }
      });
  };

  /**
   * Handle the moving of available and selected topics in the topics transfer component.
   * @param selectedTopics The new selected topics
   */
  handleTopicsChange = (selectedTopics: string[]) => {
    /*
     * Because Ant Design gives the option names when removing options
     * but gives the option values when adding options,
     * we need to gather the topics on both cases.
     */
    const { topics } = this.props;
    // Gather topics whose name matches the selected topics.
    let ids: string[] = topics.filter((t) => selectedTopics.includes(t.name)).map((t) => t.id);
    // Gather topics whose id matches the selected topics.
    ids = ids.concat(
      topics.filter((t) => selectedTopics.includes(t.id)).map((t) => t.id),
    );
    this.setState({ appliedTopics: ids.sort(), topicsChanged: true });
  };

  /**
   * Download the current ontology file from the back-end.
   */
  downloadOntologyFile = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/ontology/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url));
  };

  /**
   * Download the current tool annotations file from the back-end.
   */
  downloadToolsAnnotationsFile = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/tools-annotations/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url));
  };

  /**
   * Download the current use case config file from the back-end.
   */
  downloadUseCaseConfigFile = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/usecase-config/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url));
  };

  /**
   * Download the current use case constraints file from the back-end.
   */
  downloadUseCaseConstraintsFile = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/usecase-constraints/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url));
  };

  /**
   * Gather and send the changes to the back-end.
   * @param values The current form values
   */
  handleSubmit = (values: any) => {
    // Add any changed values to the payload
    const { domain } = this.props;
    const { owlFiles, toolsAnnotationsFiles, runConfigFiles, constraintsFiles } = this.state;
    // Add topics of they are changed
    const { appliedTopics, topicsChanged } = this.state;

    // Only add uploaded files to payload
    const files: RMFCInput[] = [];
    if (owlFiles.length > 0) {
      const [file] = owlFiles;
      files.push({
        id: 'ontology',
        fileName: file.name,
        originFileObj: file.originFileObj,
      });
    }
    if (toolsAnnotationsFiles.length > 0) {
      const [file] = toolsAnnotationsFiles;
      files.push({
        id: 'toolsAnnotations',
        fileName: file.name,
        originFileObj: file.originFileObj,
      });
    }
    if (runConfigFiles.length > 0) {
      const [file] = runConfigFiles;
      files.push({
        id: 'useCaseRunConfig',
        fileName: file.name,
        originFileObj: file.originFileObj,
      });
    }
    if (constraintsFiles.length > 0) {
      const [file] = constraintsFiles;
      files.push({
        id: 'useCaseConstraints',
        fileName: file.name,
        originFileObj: file.originFileObj,
      });
    }

    // Prepare payload to front-end endpoint
    ReadMultipleFileContents(files, (fileContents) => {
      const endpoint: string = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/edit`;
      fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
          values,
          fileContents,
          appliedTopics,
          topicsChanged,
        }),
      })
        .then((res) => {
          // If the patch failed, notify the user
          if (res.status !== 200) {
            message.error('Failed to update domain!');
            return;
          }
          message.success('Domain has been updated');
        });
    });
  };

  /**
   * User confirmed wish to leave page without saving changes.
   * Leave the page.
   */
  confirmCancel = () => {
    const { router } = this.props;
    router.push('/');
  };

  /**
   * Change the visibility of a modal by its name.
   * @param name The name of the modal to change the visibility of.
   * @param visible Whether the modal should be visible or not.
   */
  updateModalVisibility = (name: string, visible: boolean) => {
    const { visibleModals: modals } = this.state;
    modals[name] = visible;
    this.setState({ visibleModals: modals });
  };

  render() {
    const { domain } = this.props;
    const {
      appliedTopics,
      useCaseConfigExists,
      useCaseConstraintsExists,
      owlFiles,
      toolsAnnotationsFiles,
      topicList,
      runConfigFiles,
      constraintsFiles,
      visibleModals,
    } = this.state;

    return (
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{
            ...domain,
            strictToolsAnnotations: domain.strictToolsAnnotations.toString(),
          }}
          onFinish={this.handleSubmit}
          className={styles['Domain-edit']}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'A name is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[{ required: true, message: 'A description is required' }]}
              >
                <Input.TextArea />
              </Form.Item>

              <Form.Item
                label="Visibility"
                name="visibility"
                tooltip={{
                  title: (
                    <div>
                      <div>Who can use the domain?</div>
                      <ul>
                        <li>Private: only you and people you give access.</li>
                        <li>Public: everyone, even those without an account.</li>
                      </ul>
                    </div>
                  ),
                  color: 'black',
                }}
              >
                <Select data-testid="visibility-select">
                  {
                    /* Loop over the Visibility enum keys and add all options */
                    Object.keys(Visibility).map((value) => (
                      <Option value={Visibility[value]} key={value}>{value}</Option>
                    ))
                  }
                </Select>
              </Form.Item>
              <Form.Item
                name="topics"
                label="Topic(s):"
                rules={[{ required: true, message: 'At least one topic is required' }]}
              >
                <Select
                  mode="multiple"
                  dropdownMatchSelectWidth={false}
                  onChange={this.handleTopicsChange}
                  value={appliedTopics}
                >
                  {topicList}
                </Select>
              </Form.Item>
              <Form.Item
                name="useCaseRunConfig"
                label={(
                  <div>
                    Run configuration
                    <Button
                      shape="circle"
                      size="small"
                      icon={<InfoOutlined />}
                      onClick={() => this.updateModalVisibility('run_config', true)}
                    />
                  </div>
                )}
              >
                <Space>
                  <Upload
                    beforeUpload={validateJSON}
                    accept=".json"
                    onChange={
                      (info) => (
                        onFileChange(info, (list) => this.setState({ runConfigFiles: list }))
                      )
                    }
                    fileList={runConfigFiles}
                  >
                    <Button icon={<UploadOutlined />}>Upload new file</Button>
                  </Upload>

                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={this.downloadUseCaseConfigFile}
                    disabled={!useCaseConfigExists}
                  >
                    Download current file
                  </Button>
                </Space>
              </Form.Item>
              <Form.Item
                name="useCaseConstraints"
                label={(
                  <div>
                    Constraints
                    <Button
                      shape="circle"
                      size="small"
                      icon={<InfoOutlined />}
                      onClick={() => this.updateModalVisibility('constraints', true)}
                    />
                  </div>
                )}
              >
                <Space>
                  <Upload
                    beforeUpload={validateJSON}
                    accept=".json"
                    onChange={
                      (info) => (
                        onFileChange(info, (list) => this.setState({ constraintsFiles: list }))
                      )
                    }
                    fileList={constraintsFiles}
                  >
                    <Button icon={<UploadOutlined />}>Upload new file</Button>
                  </Upload>

                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={this.downloadUseCaseConstraintsFile}
                    disabled={!useCaseConstraintsExists}
                  >
                    Download current file
                  </Button>
                </Space>
              </Form.Item>
            </Col>

            <Col span={12} pull={1}>
              <Form.Item
                label="Ontology prefix"
                name="ontologyPrefixIRI"
                rules={[{ required: true, message: 'Ontology prefix is required' }]}
                tooltip={{ title: 'Prefix of the ontology classes that will be used when full IRI is not provided.', color: 'black' }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tools taxonomy root"
                name="toolsTaxonomyRoot"
                rules={[{ required: true, message: 'Tools taxonomy root is required' }]}
                tooltip={{ title: 'Ontology class (full IRI or class label) that corresponds to the tool taxonomy root.', color: 'black' }}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="dataDimensionsTaxonomyRoots"
                label="Data taxonomy roots:"
                rules={[{ required: true, message: 'A data taxonomy root is required' }]}
                tooltip={{ title: 'Ontology classes (full IRI or class label) that correspond to the data taxonomy roots, separated by "tab", "space", "comma" or ";".', color: 'black' }}
              >
                <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',', ' ', ';']} open={false} />
              </Form.Item>

              <Form.Item
                name="strictToolsAnnotations"
                label="Use strict tools annotations: "
                rules={[{ required: true, message: 'Strict tools annotations is required' }]}
              >
                <Select
                  dropdownMatchSelectWidth={false}
                >
                  <Option value="false">False</Option>
                  <Option value="true">True</Option>
                </Select>
              </Form.Item>

              <Form.Item
                label={(
                  <div>
                    Ontology file
                    <Button
                      shape="circle"
                      size="small"
                      icon={<InfoOutlined />}
                      onClick={() => this.updateModalVisibility('ontology', true)}
                    />
                  </div>
                )}
                name="ontology"
              >
                <Space>
                  <Upload
                    beforeUpload={validateOWL}
                    accept=".owl,.xml"
                    onChange={
                      (info) => (
                        onFileChange(info, (list) => this.setState({ owlFiles: list }))
                      )
                    }
                    fileList={owlFiles}
                  >
                    <Button icon={<UploadOutlined />}>Upload new file</Button>
                  </Upload>

                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={this.downloadOntologyFile}
                  >
                    Download current file
                  </Button>
                </Space>
              </Form.Item>

              <Form.Item
                label={(
                  <div>
                    Tool annotations file
                    <Button
                      shape="circle"
                      size="small"
                      icon={<InfoOutlined />}
                      onClick={() => this.updateModalVisibility('tool_annotations', true)}
                    />
                  </div>
                )}
                name="toolsAnnotations"
              >
                <Space>
                  <Upload
                    beforeUpload={validateJSON}
                    accept=".json"
                    onChange={
                      (info) => (
                        onFileChange(info, (list) => this.setState({ toolsAnnotationsFiles: list }))
                      )
                    }
                    fileList={toolsAnnotationsFiles}
                  >
                    <Button icon={<UploadOutlined />}>Upload new file</Button>
                  </Upload>

                  <Button
                    type="text"
                    icon={<DownloadOutlined />}
                    onClick={this.downloadToolsAnnotationsFile}
                  >
                    Download current file
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row className={styles.buttonsContainer} justify="end">
            <Col pull={3}>
              <Space>
                <Button type="primary" htmlType="submit" data-testid="saveButton">
                  Save
                </Button>
                <Popconfirm
                  title="Any changes are not saved! Are you sure?"
                  onConfirm={this.confirmCancel}
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                >
                  <Button data-testid="cancelButton">Cancel</Button>
                </Popconfirm>
              </Space>
            </Col>
          </Row>
        </Form>

        { // Ontology file modal
          ontologyModal(visibleModals.ontology, () => this.updateModalVisibility('ontology', false))
        }

        { // Tools annotations file modal
          toolAnnotationsModal(visibleModals.tool_annotations, () => this.updateModalVisibility('tool_annotations', false))
        }

        { // Run configuration file modal
          runConfigModal(visibleModals.run_config, () => this.updateModalVisibility('run_config', false))
        }

        { // Constraints file modal
          constraintsModal(visibleModals.constraints, () => this.updateModalVisibility('constraints', false))
        }
      </div>
    );
  }
}

export default DomainEdit;
