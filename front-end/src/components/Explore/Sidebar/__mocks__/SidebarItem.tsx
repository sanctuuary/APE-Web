/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Checkbox } from 'antd';

/**
 * Mock of the sidebaritem component props.
 * This only contains the props we need for the mock.
 */
interface MockProps {
  /**
   * Index of the sidebaritem in the sidebar
   */
  index: number,
  /**
   * Indicate whether the sidebaritem is disabled or not.
   */
  disabled: boolean,
}

// Simplified mock of the sidebaritem
const SidebarItem = ({ index, disabled }: MockProps) => (
  <Checkbox disabled={disabled} value={index} />
);

export default SidebarItem;
