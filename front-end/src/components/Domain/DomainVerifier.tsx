import React from 'react';
import { getSession } from 'next-auth/client';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { DomainVerificationResult } from '@models/Domain';

const { Step } = Steps;

/**
 * The props of the {@link DomainVerifier} component.
 */
interface DomainVerifierProps {
  /** The ID of the domain to verify. */
  domainId: string,
  /**
   * Callback function called when the verifier is finished.
   * @param currentStep The step the verifier finished on.
   * @param totalSteps The total number of steps.
   */
  onFinish?: (currentStep: number, totalSteps: number) => void,
}

/**
 * The state of the {@link DomainVerifier} component.
 */
interface DomainVerifierState {
  /** The current verification step. */
  currentStep: number,
  /** The status of the steps. */
  status: 'wait' | 'process' | 'finish' | 'error',
  /** The description for the "verify use case" step. */
  useCaseStepDesc: string,
}

/**
 * The initial state of the {@link DomainVerifier} component.
 */
const initialState: any = {
  currentStep: 0,
  status: 'process',
  useCaseStepDesc: 'Verify the use case configuration runs without errors.',
};

/**
 * Component to verify a domain is working correctly.
 */
class DomainVerifier extends React.Component<DomainVerifierProps, DomainVerifierState> {
  constructor(props: DomainVerifierProps) {
    super(props);
    this.state = initialState;
  }

  async componentDidUpdate(prevProps: DomainVerifierProps) {
    const { domainId, onFinish } = this.props;

    if (prevProps.domainId === domainId) {
      // Nothing changed, don't do anything.
      return;
    }

    const session: any = await getSession({});
    // eslint-disable-next-line react/no-did-update-set-state
    this.setState({ ...initialState });

    let success: boolean = true;
    success = success && await this.loadDomain(domainId);
    if (success) {
      success = success && await this.verifyOntology(session);
    }
    if (success) {
      success = success && await this.verifyUseCase(session);
    }

    if (success) {
      const { currentStep } = this.state;
      if (onFinish != null) {
        onFinish(currentStep, 3);
      }
    }
  }

  /**
   * Load a domain to create the APE instance on the back-end.
   * @param domainId The ID of the domain to load.
   * @returns Whether the domain was successfully loaded.
   */
  async loadDomain(domainId: string): Promise<boolean> {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/workflow/${domainId}`;
    const init: RequestInit = {
      method: 'GET',
      credentials: 'include',
    };

    let success: boolean = false;
    await fetch(endpoint, init)
      .then((res) => {
        if (res.status !== 200) {
          this.setState({ status: 'error' });
          return;
        }
        this.setState({ currentStep: 1 });
        success = true;
      })
      .catch(() => {
        this.setState({ status: 'error' });
      });
    return success;
  }

  /**
   * Verify the ontology of the domain in the current APE instance on the back-end.
   * @param session The current session.
   * @returns Whether the verification succeeded.
   */
  async verifyOntology(session: any): Promise<boolean> {
    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/verify/ontology`;
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

    let success: boolean = false;
    await fetch(endpoint, init)
      .then((res) => {
        if (res.status !== 200) {
          return null;
        }
        return res.json();
      })
      .then((data: DomainVerificationResult | null) => {
        if (data !== null && data.ontologySuccess) {
          this.setState({ currentStep: 2 });
          success = true;
        } else {
          this.setState({ status: 'error' });
        }
      });
    return success;
  }

  /**
   * Verify the use case of the domain in the current APE instance on the back-end.
   * @param session The current session.
   * @returns Whether the verification succeeded.
   */
  async verifyUseCase(session: any): Promise<boolean> {
    const shouldVerifyUseCase = false;
    if (!shouldVerifyUseCase) {
      this.setState({ currentStep: 3, useCaseStepDesc: '(No use case given)' });
      return true;
    }

    const endpoint = `${process.env.NEXT_PUBLIC_BASE_URL}/api/workflow/verify/useCaseConfig`;
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

    let success: boolean = false;
    await fetch(endpoint, init)
      .then((res) => {
        if (res.status !== 200) {
          return null;
        }
        return res.json();
      })
      .then((data: DomainVerificationResult | null) => {
        if (data !== null && data.useCaseSuccess) {
          this.setState({ currentStep: 3 });
          success = true;
        } else {
          this.setState({ status: 'error' });
        }
      });
    return success;
  }

  render() {
    const { currentStep, status, useCaseStepDesc } = this.state;

    return (
      <Steps current={currentStep} status={status}>
        <Step
          title="Load"
          description="Load the domain."
        />
        <Step
          title="Verify ontology"
          description="Verify the domain runs without critical errors."
          icon={currentStep === 1 && status !== 'error' ? (<LoadingOutlined />) : null}
        />
        <Step
          title="Verify use case"
          description={useCaseStepDesc}
          icon={currentStep === 2 && status !== 'error' ? (<LoadingOutlined />) : null}
        />
      </Steps>
    );
  }
}

export default DomainVerifier;
