/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Layout } from 'antd';
import Explore from '@components/Explore/Explore';
import { Ontology, ConstraintType, DataType, OntologyNode, RunOptions } from '@models/workflow/Workflow';
import WorkflowData from '@models/workflow/WorkflowVisualizerData';
import WorkflowInput from '@components/WorkflowInput/WorkflowInput';
import Domain from '@models/Domain';
import fetchWithRedirect from '@helpers/FetchWithRedirect';
import styles from '@pages/app.module.less';
import { Config } from '@models/Configuration/Config';
import { ConstraintsConfig } from '@models/Configuration/ConstraintsConfig';
import { getSession } from 'next-auth/client';

/**
 * Props for {@link ExplorePage}
 */
interface IExplorePageProps {
  /** The domain to explore */
  domain: Domain,
  /** The run parameters limits from the back-end */
  runParametersLimits: RunOptions,
}

/** The state interface for {@link ExplorePage} */
interface IExplorePageState {
  /** The workflows to be displayed */
  workflows: WorkflowData[];
  /** The domain data */
  data: {
    /** The data ontology */
    dataOntology: Ontology,
    /** The tool ontology */
    toolOntology: Ontology,
    /** The constraint options */
    constraintOptions: ConstraintType[],
    /** The use case config */
    useCaseConfig: Config;
    /** The use case constraints config */
    useCaseConstraints: ConstraintsConfig;
  }
}

/**
 * Props for the {@link RenderWorkflows} sub-component.
 */
interface RenderWorkflowsProps {
  /** The workflows to render */
  workflows: WorkflowData[];
}

/**
 * Functional component to handle conditional rendering of workflows
 *
 * Only show workflows if there are workflows to display (workflows !== null)
 */
function RenderWorkflows({ workflows }: RenderWorkflowsProps) {
  if (workflows === null || workflows.length === 0) {
    // Show nothing
    return null;
  }
  // Show workflow
  return (
    <Explore workflows={workflows} />
  );
}

export function ontologyToList(ontology: Ontology): DataType[][] {
  const output: DataType[][] = [];
  if (ontology.roots.length === 0) {
    return [];
  }

  /**
   * Recursive function to flatten a node to a list.
   * @param node - The starting node.
   * @param type - The type of the root. Can be found in the root origin id.
   * @return - A list with the the node value at the top followed
   * by all children values.
   */
  const treeConcat = (node: OntologyNode, type: string): DataType[] => {
    let list: DataType[] = [];

    // Put the node value on top
    list.push({ label: node.label, type, id: node.id });

    // Check whether the node has children
    if (node.children != null) {
      // Flatten each child and concat it to the list
      node.children.forEach((child: OntologyNode) => {
        list = list.concat(treeConcat(child, type));
      });
    }

    return list;
  };

  // Concat each root and add it to the list of data types
  ontology.roots.forEach((dataType: OntologyNode, i: number) => {
    let options: DataType[] = [];
    const rootId = ontology.roots[i].id;

    options = options.concat(treeConcat(dataType, rootId));

    output.push(options);
  });

  return output;
}

/**
 * The explore page component.
 * This is the primary page of the website:
 * it is used by users to explore domains by generating workflows.
 *
 * Includes the workflow input and workflows display.
 * Responsible for making the back-end call to generate workflows and store the
 * received workflows.
 */
class ExplorePage extends React.Component<IExplorePageProps, IExplorePageState> {
  /** Ref to the region where workflows are shown */
  workflowViewRef: React.RefObject<HTMLDivElement> = React.createRef();

  constructor(props: IExplorePageProps) {
    super(props);

    /*
     * Even though we initiate the values of the data in initAPE, we have
     * to assign a value, because to order of calls is:
     * constructor -> render -> componentDidMount -> render
     * And otherwise the first render will fail
     */
    this.state = {
      workflows: null,
      data: {
        dataOntology: { title: undefined, id: undefined, roots: [] },
        toolOntology: {
          title: undefined,
          id: undefined,
          roots: [{ label: null, id: null, children: [] }],
        },
        constraintOptions: undefined,
        useCaseConfig: undefined,
        useCaseConstraints: undefined,
      },
    };
  }

  async componentDidMount() {
    const { domain } = this.props;
    await this.initAPE(domain.id).then((data) => this.setState({ data }));
  }

  /**
   * Initiate APE and fetch the data, tool and constraint options.
   * @param id - the domain ID. Used to initiate APE with the right domain.
   * @return - Promise the data, tool, and constraint options and the use case
   */
  initAPE = async (id: string): Promise<{
    dataOntology: Ontology,
    toolOntology: Ontology,
    constraintOptions: ConstraintType[],
    useCaseConfig: Config,
    useCaseConstraints: ConstraintsConfig
  }> => {
    // Instantiate APE
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/workflow/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .catch((error) => console.error('APE instantiate error', error));

    // The base URL for the data, tool, and constraint fetch
    const base = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow`;

    // Instantiate variables, so if fetch fails, these will have an empty value
    let dataOntology: Ontology = { title: undefined, id: undefined, roots: [] };
    let toolOntology: Ontology = {
      title: undefined,
      id: undefined,
      roots: [{ label: null, id: null, children: [] }],
    };
    let constraintOptions: ConstraintType[] = [];
    let useCaseConfig: Config;
    let useCaseConstraints: ConstraintsConfig;

    // Fetch data options
    await fetchWithRedirect(`${base}/data`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json: Ontology) => {
        // APE label is part of a future feature. Ignore it for now.
        const noApeLabel = json;
        noApeLabel.roots = noApeLabel.roots.filter((r) => r.id !== 'APE_label');
        dataOntology = noApeLabel;
      })
      .catch((error) => console.error('Data fetch error', error));

    // Fetch tool options
    await fetch(`${base}/tools`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        toolOntology = json;
      })
      .catch((error) => console.error('Tool fetch error', error));

    // Fetch constraint options
    await fetch(`${base}/constraints`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((json) => {
        constraintOptions = json;
      })
      .catch((error) => console.error('Constraint fetch error', error));

    // Fetch use cases
    await fetch(`${base}/useCaseConfig`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 500) {
          // There is no run config for this domain
          return Promise.reject(new Error('No use case available in this domain.'));
        }
        return response.json();
      })
      .then((json) => {
        useCaseConfig = json;
      })
      // eslint-disable-next-line no-console
      .catch((error: Error) => console.log(error.message));
    await fetch(`${base}/useCaseConstraints`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (response.status === 500) {
          // There is no run config for this domain
          return Promise.reject(new Error('No use case constraints available in this domain.'));
        }
        return response.json();
      })
      .then((json) => {
        useCaseConstraints = json;
      })
      // eslint-disable-next-line no-console
      .catch((error: Error) => console.log(error.message));

    return {
      dataOntology,
      toolOntology,
      constraintOptions,
      useCaseConfig,
      useCaseConstraints,
    };
  };

  /**
   * Downloads an ontology file from the back-end.
   */
  downloadOntologyFile = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/ontology/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url))
      .catch((error) => console.error('Error downloading ontology file :(.', error));
  };

  /**
   * Downloads a tools annotations file from the back-end.
   */
  downloadToolsAnnotations = async () => {
    const { domain } = this.props;
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/domain/download/tools-annotations/${domain.id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response:Response) => window.open(response.url))
      .catch((error) => console.error('Error downloading tools annotations :(.', error));
  };

  /**
   * Function for the run button in the parameter section.
   * Gets the parameters from {@link WorkflowInput}
   * and makes a call to the back-end to generate workflows.
   * Assigns the generated workflows to the workflows in {@link IExplorePageState},
   * and scrolls the screen to the workflows.
   *
   * @param workflows the workflows generated by APE.
   */
  onRun = (workflows: WorkflowData[]): void => {
    this.setState({ workflows });
    // Only scroll to the workflows when there actually are any
    if (workflows.length > 0) {
      const element = this.workflowViewRef.current;
      /**
       * Scroll to element directly scrolls too far down, calculate the correct position.
       * Y offset of 60 ensures the workflow Layout element touches the header
       */
      const y: number = element.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  render() {
    const { workflows, data } = this.state;
    const { domain, runParametersLimits } = this.props;
    const {
      dataOntology,
      toolOntology,
      constraintOptions,
      useCaseConfig,
      useCaseConstraints,
    } = data;

    return (
      <div data-testid="explore">
        <Head>
          <title>{domain.title} | APE</title>
        </Head>
        <Layout data-testid="parameters" className={styles.Ant}>
          <WorkflowInput
            downloadToolsAnnotationsFile={this.downloadToolsAnnotations}
            downloadOntologyFile={this.downloadOntologyFile}
            onRun={this.onRun}
            dataOntology={dataOntology}
            toolOntology={toolOntology}
            constraintOptions={constraintOptions}
            useCaseConfig={useCaseConfig}
            useCaseConstraints={useCaseConstraints}
            domain={domain.id}
            runParametersLimits={runParametersLimits}
          />
        </Layout>
        <div ref={this.workflowViewRef}>
          <Layout
            data-testid="workflows"
            className={styles.Ant}
            style={{
              marginTop: '10px',
            }}
          >
            <RenderWorkflows workflows={workflows} />
          </Layout>
        </div>
      </div>
    );
  }
}

export async function getServerSideProps({ req, query }) {
  const session: any = await getSession({ req });

  // Get the current domain
  const domainEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/domain/${query.id}/`;
  let domain: any = {};
  const init: RequestInit = {
    method: 'GET',
    credentials: 'include',
  };
  // Only include cookie if a user is logged in
  if (session !== null) {
    init.headers = {
      cookie: session.user.sessionid,
    };
  }
  await fetch(domainEndpoint, init)
    .then((response) => {
      if (response.status !== 200) {
        throw new Error(`Failed to GET domain: ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => { domain = data; })
    .catch(() => { domain.id = query.id; });

  // Get the run parameters limits
  let runParametersLimits: RunOptions;
  const runParametersEndpoint = `${process.env.NEXT_PUBLIC_BASE_URL_NODE}/runparameters/`;
  await fetch(runParametersEndpoint, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((data) => { runParametersLimits = data; });

  return {
    props: { domain, runParametersLimits },
  };
}

export default ExplorePage;
