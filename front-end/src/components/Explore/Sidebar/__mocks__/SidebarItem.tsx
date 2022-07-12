/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Checkbox } from 'antd';

/**
 * Mock of the sidebar item component props.
 * This only contains the props we need for the mock.
 */
interface MockProps {
  /**
   * Index of the sidebar item in the sidebar
   */
  index: number,
  /**
   * Indicate whether the sidebar item is disabled or not.
   */
  disabled: boolean,
}

// Simplified mock of the sidebar item
function SidebarItem({ index, disabled }: MockProps) {
  return <Checkbox disabled={disabled} value={index} />;
}

export default SidebarItem;
