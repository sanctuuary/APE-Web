/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { NextRouter } from 'next/router';
import { Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { validateJSON, validateOWL, onFileChange } from '@components/Domain/Domain';
import { ReadMultipleFileContents, RMFCInput } from '@helpers/ReadFileContent';
import Domain, { Topic, Visibility } from '@models/Domain';
import styles from './DomainEdit.module.scss';

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
  topicList: any[]
  /** The topics that are selected to use for this domain */
  appliedTopics: string[],
  /** Whether the topics have been changed and should be sent to the back-end */
  topicsChanged: boolean,
  /** Onyology file to upload */
  owlFiles: UploadFile<any>[],
  /** Tools annotations file to upload */
  toolsAnnotationsFiles: UploadFile<any>[],
  /** Run config file to upload */
  runConfigFiles: UploadFile<any>[],
  /** Constraint file to upload */
  constraintsFiles: UploadFile<any>[],
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
      owlFiles: [],
      toolsAnnotationsFiles: [],
      runConfigFiles: [],
      constraintsFiles: [],
    };
  }

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
   * Handle changes to the owl file upload.
   * @param info Upload changes information
   */
  onOwlChange = (info) => {
    const updatedList = onFileChange(info);
    this.setState({ owlFiles: updatedList });
  };

  /**
   * Handle changes to the tools taxonomy file upload.
   * @param info Upload changes information
   */
  onToolsAnnotationsChange = (info) => {
    const updatedList = onFileChange(info);
    this.setState({ toolsAnnotationsFiles: updatedList });
  };

  onRunConfigChange = (info) => {
    const updatedList = onFileChange(info);
    this.setState({ runConfigFiles: updatedList });
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

  render() {
    const { domain } = this.props;
    const { appliedTopics, owlFiles, toolsAnnotationsFiles, topicList,
      runConfigFiles, constraintsFiles } = this.state;

    return (
      <div>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={domain}
          onFinish={this.handleSubmit}
          className={styles['Domain-edit']}
        >
          <Row>
            <Col span={12}>
              <Form.Item
                label="Title"
                name="title"
                rules={[{ required: true, message: 'A domain title is required' }]}
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
                label="Run configuration:"
                tooltip={{ title: 'Configuration used for a demo run' }}
              >
                <Upload
                  beforeUpload={validateJSON}
                  onChange={onFileChange}
                  fileList={runConfigFiles}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
              <Form.Item
                name="useCaseConstraints"
                label="Constraints:"
                tooltip={{ title: 'Constraints used for a demo run' }}
              >
                <Upload
                  beforeUpload={validateJSON}
                  onChange={onFileChange}
                  fileList={constraintsFiles}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>
            </Col>

            <Col span={12} pull={1}>
              <Form.Item
                label="Ontology prefix"
                name="ontologyPrefixIRI"
                rules={[{ required: true, message: 'Ontology prefix is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Tools taxonomy root"
                name="toolsTaxonomyRoot"
                rules={[{ required: true, message: 'Tools taxonomy root is required' }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="dataDimensionsTaxonomyRoots"
                label="Data taxonomy roots:"
                rules={[{ required: true, message: 'A data taxonomy root is required' }]}
                tooltip={{ title: 'Comma separated, with optional spaces' }}
              >
                <Select mode="tags" style={{ width: '100%' }} tokenSeparators={[',', ' ', ';']} open={false} />
              </Form.Item>

              <Form.Item
                label="OWL file"
                name="ontology"
                valuePropName="ontology"
              >
                <Upload
                  beforeUpload={validateOWL}
                  onChange={this.onOwlChange}
                  fileList={owlFiles}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
              </Form.Item>

              <Form.Item
                label="Tools annotations file"
                name="toolsAnnotations"
                valuePropName="toolsAnnotations"
              >
                <Upload
                  beforeUpload={validateJSON}
                  onChange={this.onToolsAnnotationsChange}
                  fileList={toolsAnnotationsFiles}
                >
                  <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
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
      </div>
    );
  }
}

export default DomainEdit;
