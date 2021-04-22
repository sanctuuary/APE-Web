/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * The privacy policy page.
 */
function PrivacyPage() {
  return (
    <div>
      <Head>
        <title>Privacy | APE</title>
      </Head>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <Title>APE Web View Privacy Policy</Title>
          <Paragraph>
            At APE WEb View, accessible at ape.science.uu.nl,
            one of our main priorities is the privacy of our visitors.
            This Privacy Policy document contains types of information
            that is collected and recorded by the APE Web View website and how we use it.
          </Paragraph>
          <Paragraph>
            If you have additional questions or require more information about our Privacy Policy,
            do not hesitate to contact us through email
            at v.kasalica[at]uu.nl or a.l.lamprecht[at]uu.nl.
          </Paragraph>
          <Paragraph>
            This privacy policy applies only to our online activities and is valid for
            visitors to our website with regards to the information that they shared and/or
            collect in APE Web View.
            This policy is not applicable to any information collected offline
            or via channels other than this website.
          </Paragraph>

          <Title level={2}>Consent</Title>
          <Paragraph>
            By using our website, you hereby consent to our Privacy Policy and agree to its terms.
          </Paragraph>
          <Title level={2}>Information we collect</Title>
          <Paragraph>We don&apos;t collect any information.</Paragraph>
        </Col>
      </Row>
    </div>
  );
}

export default PrivacyPage;
