/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Layout, Menu, Dropdown, Row, Col } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { useSession, signOut } from 'next-auth/client';
import styles from './Header.module.scss';

/**
 * The header component, used accross the entire site.
 */
function Header() {
  const [session]: any = useSession();

  const createDomain = () => {
    if (session && session.user) {
      return (
        <Menu.Item key="1">
          <a href="/domain/new">Create a domain</a>
        </Menu.Item>
      );
    }
    return null;
  };

  const admin = () => session && session.user && session.user.admin;

  // Menu items that are used in the dropdown
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/">Home</a>
      </Menu.Item>
      {createDomain()}
    </Menu>
  );

  // Menu to show when the user is logged in, and they press on their displayname.
  const usermenu = (
    <Menu>
      {admin()
      && (
      <>
        <Menu.Item key="0">
          <a href="/admin">Administrator page</a>
        </Menu.Item>
        <Menu.Divider />
      </>
      )}
      <Menu.Item key="1">
        <div role="button" tabIndex={0} onClick={() => signOut} onKeyPress={() => {}}>
          Sign out
        </div>
      </Menu.Item>
    </Menu>
  );

  // If the user is logged in show their displayname instead of login
  const login = () => {
    if (session && session.user) {
      document.cookie = `${session.user.sessionid}; path:'/'`;
      return (
        <Dropdown
          overlay={usermenu}
          trigger={['click']}
          getPopupContainer={(node) => node.parentElement}
        >
          <span className={styles['Header-user']}>{session.user.displayName}</span>
        </Dropdown>
      );
    }
    return (
      <a href="/login">
        Login
      </a>
    );
  };

  return (
    <Layout.Header className={styles.Header}>
      <Row>
        <Col span={8}>
          <a href="/" className={styles['Header-logo-link']}>
            <img src="/logo.png" className={styles['Header-logo']} alt="logo" />
            <h1 className={styles['Header-title']}>APE</h1>
          </a>
        </Col>
        <Col span={8} pull={6}>
          <Dropdown
            overlay={menu}
            trigger={['click']}
            getPopupContainer={(node) => node.parentElement}
          >
            <MenuOutlined className={styles['Header-menu']} />
          </Dropdown>
        </Col>
        <Col span={8} push={6}>
          {login()}
        </Col>
      </Row>
    </Layout.Header>
  );
}

export default Header;
