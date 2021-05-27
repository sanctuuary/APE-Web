/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { InfoCircleFilled } from '@ant-design/icons';
import { Popover } from 'antd';
import styles from './TooltipIcon.module.less';

/**
 * Props for {@link TooltipIcon}.
 */
interface TooltipIconProps {
  /** The title for the popover tooltip */
  title?: string;
  /** The text to show in the tooltip. */
  content: string | React.ReactNode;
}

/**
 * An icon which shows a tooltip on hover.
 */
function TooltipIcon({ title, content }: TooltipIconProps) {
  let actualContent: React.ReactNode;
  if (typeof content === 'string') {
    // If a string is given, use the string as the content for the popover
    actualContent = (<p style={{ marginBottom: 0, whiteSpace: 'pre-line' }}>{content}</p>);
  } else {
    // Else use the given HTML content in the popover
    actualContent = content;
  }

  return (
    <Popover
      title={title}
      content={actualContent}
      placement="bottomRight"
      arrowPointAtCenter={true}
    >
      <InfoCircleFilled className={styles.TooltipIcon} />
    </Popover>
  );
}

/**
 * The default values of the props for {@link TooltipIcon}.
 */
TooltipIcon.defaultProps = {
  title: null,
};

export default TooltipIcon;
