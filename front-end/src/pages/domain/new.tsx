/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { getSession } from 'next-auth/client';
import { NextRouter, useRouter } from 'next/router';
import Head from 'next/head';
import { Alert, Button, Card, Col, message, Result, Row, Space, Typography } from 'antd';
import DomainCreate from '@components/Domain/DomainCreate/DomainCreate';
import DomainVerifier from '@components/Domain/DomainVerifier';
import { fetchTopics } from '@components/Domain/Domain';
import { Topic } from '@models/Domain';
import styles from './edit/[id].module.less';

const { Title } = Typography;

/**
 * Props for the {@link CreateDomain} page.
 */
interface CreateDomainPageProps {
  /** The available topics. */
  topics: Topic[],
}

/**
 * The page for creating domains.
 */
function CreateDomain(props: CreateDomainPageProps) {
  const router: NextRouter = useRouter();
  const [domainId, setDomainId] = React.useState<string>(null);
  const [verified, setVerified] = React.useState<boolean>(false);
  const [verificationError, setVerificationError] = React.useState<string>(null);

  const { topics } = props;

  /**
   * Update the domain ID to trigger the verifier after the domain has been created.
   * @param id The ID of the created domain.
   */
  const afterCreate = (id: string) => {
    setDomainId(id);
    message.success('Domain successfully created');
  };

  /** Domain creation cancelled, go back to home page. */
  const onCancel = () => router.push('/');

  /**
   * Verification is done. Act according to the results.
   */
  const onVerifyFinished = (currentStep: number, totalSteps: number) => {
    if (currentStep < totalSteps) {
      return;
    }
    setVerified(true);
    message.success('Domain verified');
  };

  /**
   * An error occurred during verification. Display the error to the user.
   */
  const onVerifyError = (currentStep: number, error: string) => {
    setVerificationError(error);
  };

  return (
    <div>
      <Head>
        <title>Create domain | APE</title>
      </Head>
      {topics === null ? (
        <div>
          {/* User was not logged in. */}
          <Result
            status="403"
            title="403 Forbidden"
            subTitle="You must be logged in to access this page."
            extra={<Button type="primary" href="/login">Go to login</Button>}
          />
        </div>
      ) : (
        <div className={styles.sideMargins}>
          {/* User is logged in, page successfully loaded. */}
          <DomainCreate
            topics={topics}
            onCreated={afterCreate}
            onCancelled={onCancel}
          />
          <div style={{ marginLeft: 200, marginRight: 200 }}>
            <Title level={3}>Verification</Title>
            <Card>
              <DomainVerifier
                domainId={domainId}
                onFinish={onVerifyFinished}
                onError={onVerifyError}
              />
              {verificationError !== null && (
                <div>
                  <Row>
                    <Col span={12} push={6}>
                      <Alert
                        message="Verification error"
                        description={verificationError}
                        type="error"
                        showIcon
                      />
                    </Col>
                  </Row>
                  <Row style={{ marginTop: 10 }}>
                    <Col span={6} push={9}>
                      <Space style={{ width: '100%', justifyContent: 'center' }}>
                        <Button size="large" href="/">Back to home</Button>
                        <Button size="large" href={`/domain/edit/${domainId}`} type="primary">Edit domain</Button>
                      </Space>
                    </Col>
                  </Row>
                </div>
              )}
            </Card>
          </div>

          {verified && (
            <Row style={{ marginTop: 25 }}>
              <Col span={6} push={9}>
                <Space style={{ width: '100%', justifyContent: 'center' }}>
                  <Button size="large" href="/">Back to home</Button>
                  <Button size="large" type="primary" href={`/explore/${domainId}`}>Go to domain</Button>
                </Space>
              </Col>
            </Row>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const session: any = await getSession({ req });

  if (session === null) {
    return {
      props: { topics: null },
    };
  }

  const topics: Topic[] = await fetchTopics(session.user, true);

  return {
    props: { topics },
  };
}

export default CreateDomain;
