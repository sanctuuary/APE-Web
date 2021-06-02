/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph, Link } = Typography;

/**
 * The "contact us" page.
 */
function ContactPage() {
  return (
    <div>
      <Head>
        <title>Contact | APE</title>
      </Head>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <Title>Contact</Title>
          <Paragraph>&nbsp;</Paragraph>
          <Paragraph>
            For any questions concerning APE and APE Web you can get in touch with:
          </Paragraph>
          <ul>
            <li>Vedran Kasalica (<Link href="mailto:v.kasalica@uu.nl">v.kasalica[at]uu.nl</Link>), lead developer</li>
            <li>Anna-Lena Lamprecht (<Link href="mailto:a.l.lamprecht@uu.nl">a.l.lamprecht[at]uu.nl</Link>), project initiator and principal investigator</li>
          </ul>
        </Col>
      </Row>
    </div>
  );
}

export default ContactPage;
