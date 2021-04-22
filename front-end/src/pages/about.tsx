/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import Head from 'next/head';
import { Col, Row, Typography } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * The "about us" page.
 */
function AboutPage() {
  return (
    <div>
      <Head>
        <title>About us | APE</title>
      </Head>
      <Row>
        <Col span={6} />
        <Col span={12}>
          <Title>About us</Title>
          <Paragraph>
            APE Web View is a graphical interface for the <strong>APE library</strong>.
            APE (Automated Pipeline Explorer) is a command line tool and Java API
            for the automated exploration of possible computational pipelines
            (scientific workflows) from large collections of computational tools.
          </Paragraph>
          <Paragraph>
            APE relies on a semantic domain model that includes tool and type taxonomies
            as controlled vocabularies for the description of computational tools,
            and functional tool annotations (inputs, outputs, operations performed)
            using terms from these taxonomies.
            Based on this domain model and a specification of the available workflow inputs,
            the intended workflow outputs and possibly additional constraints,
            APE then computes possible workflows.
          </Paragraph>
          <Paragraph>
            Internally, APE uses a component-based program synthesis approach.
            It translates the domain knowledge and workflow specification
            into logical formulas that are then fed to a SAT solver
            to compute satisfying instances.
            These solutions are then translated into the actual candidate workflows.
          </Paragraph>
          <Paragraph>
            For more information and sources,
            see the <a href="https://github.com/sanctuuary/APE/">APE GitHub repository</a>&nbsp;
            or the <a href="https://ape-framework.readthedocs.io/en/latest/">APE documentation page</a>.
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}

export default AboutPage;
