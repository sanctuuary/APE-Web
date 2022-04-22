/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Select, Form, Button, Input, Upload, message, Col, Row, Space, Popconfirm } from 'antd';
import { UploadFile } from 'antd/lib/upload/interface';
import { InfoOutlined, UploadOutlined } from '@ant-design/icons';
import { Topic, Visibility } from '@models/Domain';
import { constraintsModal, ontologyModal, runConfigModal, toolAnnotationsModal } from '@components/Domain/Domain';
import { validateJSON, validateOWL, onFileChange, ReadMultipleFileContents, RMFCInput } from '@helpers/Files';
import styles from './DomainCreate.module.less';

const { Option } = Select;

/**
 * The props of the {@link DomainCreate} component.
 */
interface DomainCreateProps {
  /** All available topics. */
  topics: Topic[],
  /** Callback function called when the domain is created. */
  onCreated?: (domainId: string) => void,
  /** Callback function called when the domain creation is cancelled. */
  onCancelled?: () => void,
}

/**
 * The state of the {@link DomainCreate} component.
 */
interface IState {
  /** The OWL file for the domain */
  ontology: UploadFile<any>[];
  /** The tool annotations JSON file */
  toolsAnnotations: UploadFile<any>[];
  /** The run config JSON file */
  runConfig: UploadFile<any>[];
  /** The constraints JSON file */
  constraints: UploadFile<any>[];
  /** Whether each of the tooltip modals are visible. */
  visibleModals: { [name: string]: boolean };
  /** Whether the domain has been created. */
  created: boolean,
}

/**
 * Form for creating new APE domains.
 */
class DomainCreate extends React.Component<DomainCreateProps, IState> {
  /**
   * Constructor
   * @param props DomainCreate has no props
   */
  constructor(props: DomainCreateProps) {
    super(props);

    this.state = {
      ontology: [],
      toolsAnnotations: [],
      runConfig: [],
      constraints: [],
      visibleModals: {
        ontology: false,
        tool_annotations: false,
        run_config: false,
        constraints: false,
      },
      created: false,
    };
  }

  /**
   * Handle submit
   */
  handleSubmit = (values) => {
    const { onCreated } = this.props;
    const endpoint = `${process.env.NEXT_PUBLIC_FE_URL}/api/domain/upload`;

    const files: RMFCInput[] = [];
    // Add Ontology file to file contents to read
    files.push({
      id: 'ontology',
      fileName: values.ontology.file.name,
      originFileObj: values.ontology.file.originFileObj,
    });
    // Add Tools annotations file to file contents to read
    files.push({
      id: 'toolsAnnotations',
      fileName: values.toolsAnnotations.file.name,
      originFileObj: values.toolsAnnotations.file.originFileObj,
    });
    // Only upload run config use case when given
    if (values.useCaseRunConfig !== undefined) {
      files.push({
        id: 'useCaseRunConfig',
        fileName: values.useCaseRunConfig.file.name,
        originFileObj: values.useCaseRunConfig.file.originFileObj,
      });
    }
    // Only upload constraints use case when given
    if (values.useCaseConstraints !== undefined) {
      files.push({
        id: 'useCaseConstraints',
        fileName: values.useCaseConstraints.file.name,
        originFileObj: values.useCaseConstraints.file.originFileObj,
      });
    }

    ReadMultipleFileContents(files, (fileContents) => {
      fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values,
          fileContents,
        }),
      })
        // Print response
        .then((response) => {
          if (response.ok) {
            return response.text();
          }
          if (response.status === 413) {
            const limit = process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT;
            return Promise.reject(new Error(`Some files were too large. The maximum file size is ${limit}MB.`));
          }
          return Promise.reject(new Error('Error while trying to create domain'));
        })
        .then((data) => {
          if (onCreated !== null) {
            this.setState({ created: true });
            onCreated(data);
          }
        })
        // Catch and print any errors
        .catch((error: Error) => {
          message.error(error.message, 5);
        });
    });
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

  /**
   * Render form
   */
  render() {
    const { topics, onCancelled } = this.props;
    const {
      ontology,
      toolsAnnotations,
      runConfig,
      constraints,
      visibleModals,
      created,
    } = this.state;
    return (
      <div>
        <Form
          onFinish={this.handleSubmit}
          className={styles['Domain-create']}
          initialValues={{
            visibility: Visibility.Public,
            strictToolsAnnotations: 'False',
          }}
          encType="multipart/form-data"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title:"
                rules={[{ required: true, message: 'A name is required' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label="Description:"
                rules={[{ required: true, message: 'A description is required' }]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item
                name="visibility"
                label="Visibility:"
                rules={[{ required: true, message: 'Visibility is required' }]}
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
                <Select
                  data-testid="visibility-select"
                  dropdownMatchSelectWidth={false}
                >
                  {/* Loop over the Visibility enum keys and add all options */}
                  {Object.keys(Visibility).map((value) => (
                    <Option value={Visibility[value]} key={value}>{value}</Option>
                  ))}
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
                >
                  {topics.map((elem, i) => (
                    <Option
                      key={i.toString()}
                      value={elem.id}
                    >
                      {elem.name}
                    </Option>
                  ))}
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
                <Upload
                  beforeUpload={validateJSON}
                  accept=".json"
                  onChange={
                    (info) => (
                      onFileChange(info, (list) => this.setState({ runConfig: list }))
                    )
                  }
                  fileList={runConfig}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
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
                <Upload
                  beforeUpload={validateJSON}
                  accept=".json"
                  onChange={
                    (info) => (
                      onFileChange(info, (list) => this.setState({ constraints: list }))
                    )
                  }
                  fileList={constraints}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12} pull={1}>
              <Form.Item
                name="ontologyPrefix"
                label="Ontology prefix:"
                rules={[{ required: true, message: 'An ontology prefix is required' }]}
                tooltip={{ title: 'Prefix of the ontology classes that will be used when full IRI is not provided.', color: 'black' }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="toolsTaxonomyRoot"
                label="Tools taxonomy root:"
                rules={[{ required: true, message: 'A tools taxonomy is required' }]}
                tooltip={{ title: 'Ontology class (full IRI or class label) that corresponds to the tool taxonomy root.', color: 'black' }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="dataDimensionsTaxonomyRoots"
                label="Data taxonomy roots:"
                rules={[{ required: true, message: 'A data taxonomy root is required' }]}
                tooltip={{ title: 'Ontology classes (full IRI or class label) that correspond to the data taxonomy roots, separated by "space", "comma" or ";".', color: 'black' }}
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
                  <Option value="False">False</Option>
                  <Option value="True">True</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="ontology"
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
                rules={[{ required: true, message: 'An ontology is required' }]}
              >
                <Upload
                  beforeUpload={validateOWL}
                  accept=".owl,.xml"
                  onChange={
                    (info) => (
                      onFileChange(info, (list) => this.setState({ ontology: list }))
                    )
                  }
                  fileList={ontology}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="toolsAnnotations"
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
                rules={[{ required: true, message: 'A tool annotation is required' }]}
              >
                <Upload
                  beforeUpload={validateJSON}
                  accept=".json"
                  onChange={
                    (info) => (
                      onFileChange(info, (list) => this.setState({ toolsAnnotations: list }))
                    )
                  }
                  fileList={toolsAnnotations}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          <Row justify="end">
            <Col pull={3}>
              <Space>
                <Button type="primary" htmlType="submit" disabled={created}>
                  Create domain
                </Button>
                <Popconfirm
                  title="Any changes are not saved! Are you sure?"
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                  onConfirm={onCancelled}
                >
                  <Button data-testid="cancelButton" disabled={created}>Cancel</Button>
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

export default DomainCreate;
