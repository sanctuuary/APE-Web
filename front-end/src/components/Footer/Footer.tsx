/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Col, Divider, Layout, Row } from 'antd';
import styles from './Footer.module.scss';

/**
 * The footer component, used accross the entire site.
 */
function Footer() {
  return (
    <Layout.Footer className={styles.footer} id="Footer">
      <Row>
        <Col span={24}>
          <a href="/conditions">Conditions</a> -&nbsp;
          <a href="/privacy">Privacy</a> -&nbsp;
          <a
            // Should go to APE website license in the future
            href="https://github.com/sanctuuary/APE/blob/master/LICENSE"
            target="_blank"
            rel="noreferrer"
          >
            License
          </a> -&nbsp;
          <a href="/about">About us</a> -&nbsp;
          <a href="/contact">Contact us</a> -&nbsp;
          <a href="/vacancies">Vacancies</a>
        </Col>
      </Row>
      <Divider className={styles.divider} />
      <Row>
        <Col span={24}>
          <a href="/">
            <img className={styles.logo} src="/logo.png" alt="Website logo" />
          </a>
          <a href="https://github.com/sanctuuary/APE" target="_blank" rel="noreferrer">
            <img className={styles.logo} src="/APE-logo-440px.png" alt="APE logo" />
          </a>
          <a href="https://git.science.uu.nl/apex-devs/front-end" target="_blank" rel="noreferrer">
            <img className={styles.logo} src="/GitHub-Mark-64px.png" alt="GitHub logo" />
          </a>
          <a href="https://www.uu.nl/en" target="_blank" rel="noreferrer">
            <img className={styles.logo} src="/Utrecht_University_logo-512px.png" alt="University Utrecht logo" />
          </a>
        </Col>
      </Row>
      <Row>
        <Col span={24}>© Utrecht University (ICS)</Col>
      </Row>
    </Layout.Footer>
  );
}

export default Footer;
