import React from 'react';
import Head from 'next/head';
import { Row, Col, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * Terms and conditions page.
 */
function TermsAndConditionsPage() {
  return (
    <div>
      <Head>
        <title>Terms and conditions | APE</title>
      </Head>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <Title>Terms and conditions</Title>
          <Paragraph>
            Permission is hereby granted, free of charge, to any person to use this website.
            Any person using this website shall respect the rights of the host of this website
            and all other people using this website.
          </Paragraph>
          <Paragraph>
            The website is provided &quot;as is&quot;, without warranty of any kind,
            express or implied, including but not limited to warranties of merchantability,
            fitness for a particular purpose and noninfringement.
            In no event shall the hosts of this website be liable for any claim,
            damages or other liability, whether in an action of contract, tort or otherwise,
            arising from, out of or in connection with the website
            or the use or other dealings in the website.
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}

export default TermsAndConditionsPage;
