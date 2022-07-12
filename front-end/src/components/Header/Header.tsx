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
import styles from './Header.module.less';

/**
 * The header component, used across the entire site.
 */
function Header() {
  const [session]: any = useSession();

  const admin = () => session && session.user && session.user.admin;

  // Menu items that are used in the dropdown
  const menu = () => {
    const items = [
      { key: 0, label: <a href="/">Home</a> },
    ];
    if (session && session.user) {
      items.push({
        key: 1,
        label: <a href="/domain/new">Create a domain</a>,
      });
    }

    return (
      <Menu items={items} />
    );
  };

  // Menu to show when the user is logged in, and they press on their display name.
  // eslint-disable-next-line react/no-unstable-nested-components
  const UserMenu = () => {
    const items = [];

    if (admin()) {
      items.push({ key: 0, label: <a href="/admin">Administrator page</a> });
    }
    items.push({
      key: 1,
      label: (
        <div role="button" tabIndex={0} onClick={() => signOut()} onKeyPress={() => {}}>
          Sign out
        </div>
      ),
    });

    return (
      <Menu items={items} />
    );
  };

  // If the user is logged in show their display name instead of login
  const login = () => {
    if (session && session.user) {
      document.cookie = `${session.user.sessionid}; path:'/'`;
      return (
        <Dropdown
          overlay={UserMenu}
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
