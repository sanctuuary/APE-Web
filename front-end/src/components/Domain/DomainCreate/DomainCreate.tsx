/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Select, Form, Result, Button, Input, Upload, message, Col, Row, Space, Popconfirm } from 'antd';
import { Visibility } from '@models/Domain';
import { fetchTopics } from '@components/Domain/Domain';
import { validateJSON, validateOWL, onFileChange, ReadMultipleFileContents, RMFCInput } from '@helpers/Files';
import { useSession } from 'next-auth/client';
import { UploadOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';
import { useRouter } from 'next/router';
import styles from './DomainCreate.module.less';

const { Option } = Select;

/**
 * The state of DomainCreate
 */
interface IState {
  /** The topic of the domain */
  topics: any[];
  /** The OWL file for the domain */
  ontology: UploadFile<any>[];
  /** The tool annotations JSON file */
  toolsAnnotations: UploadFile<any>[];
  /** The run config JSON file */
  runConfig: UploadFile<any>[];
  /** The constraints JSON file */
  constraints: UploadFile<any>[];
}

/**
 * Use the session hook in a class component
 * @param Component class component that uses session hook
 * @returns the element to be rendered
 */
const withSession = (Component: any) => (props) => {
  const [session, loading] = useSession();
  const router = useRouter();

  if (loading) {
    return null;
  }
  if (session && session.user) {
    return <Component router={router} session={session} {...props} />;
  }
  return (
    <Result
      status="403"
      title="403 Forbidden"
      subTitle="You must be logged in to access this page."
      extra={<Button type="primary" href="/login">Go to login</Button>}
    />
  );
};

/**
 * Form for creating new APE domains.
 */
class DomainCreate extends React.Component<{router, session}, IState> {
  /**
   * Constructor
   * @param props DomainCreate has no props
   */
  constructor(props) {
    super(props);
    this.state = {
      topics: [],
      ontology: [],
      toolsAnnotations: [],
      runConfig: [],
      constraints: [],
    };
  }

  componentDidMount() {
    const { session } = this.props;
    fetchTopics(session.user).then((topics) => {
      const tops = topics.map((elem, i) => (
        <Option
          key={i.toString()}
          value={elem.id}
        >{elem.name}
        </Option>
      ));
      this.setState({ topics: tops });
    });
  }

  /**
   * Handle submit
   */
  handleSubmit = (values) => {
    const { router } = this.props;
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
            router.push('/');
            return Promise.resolve(message.success('Domain successfully created'));
          }
          if (response.status === 413) {
            const limit = process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT;
            return Promise.reject(new Error(`Some files were too large. The maximum file size is ${limit}MB.`));
          }
          return Promise.reject(new Error('Error while trying to create domain'));
        })
        // Catch and print any errors
        .catch((error: Error) => {
          message.error(error.message, 5);
        });
    });
  };

  /**
   * Render form
   */
  render() {
    const { ontology, toolsAnnotations, topics, runConfig, constraints } = this.state;
    const { router } = this.props;
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
                  {topics}
                </Select>
              </Form.Item>
              <Form.Item
                name="useCaseRunConfig"
                label="Run configuration:"
                tooltip={{ title: 'Configuration used for a demo run' }}
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
                label="Constraints:"
                tooltip={{ title: 'Constraints used for a demo run' }}
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
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="toolsTaxonomyRoot"
                label="Tools taxonomy root:"
                rules={[{ required: true, message: 'A tools taxonomy is required' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="dataDimensionsTaxonomyRoots"
                label="Data taxonomy roots:"
                rules={[{ required: true, message: 'A data taxonomy root is required' }]}
                tooltip={{ title: 'Press space, comma, or ";" to start typing the next one' }}
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
                label="Ontology file:"
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
                label="Tool annotations file:"
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
                <Button type="primary" htmlType="submit">
                  Create domain
                </Button>
                <Popconfirm
                  title="Any changes are not saved! Are you sure?"
                  okText="Yes"
                  cancelText="No"
                  placement="topLeft"
                  onConfirm={() => router.push('/')}
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

export default withSession(DomainCreate);
