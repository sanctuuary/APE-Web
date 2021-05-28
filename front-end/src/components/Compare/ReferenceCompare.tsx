/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import styles from '@components/Compare/ReferenceCompare.module.less';
import WorkflowDifference from '@models/workflow/WorkflowDifference';

/**
 * Props for the ReferenceComparelist
 */
interface ReferenceCompareProps {
  /**
   * The difference between a workflow and reference
   */
  difference: WorkflowDifference;
}

/**
 * A component for displaying workflow differences.
 */
function ReferenceCompare(props: ReferenceCompareProps) {
  const { difference } = props;

  /**
   * Renders a tool in the tool diff
   * @param prefix Determines the + or - sign before the diff
   * @param prop If the tools should get from the extra or missing diff
   */
  const renderToolsNotUsed = (prefix, prop) =>
  /** Disabled because the function looks beautiful this way */
  // eslint-disable-next-line max-len,implicit-arrow-linebreak
    Object.keys(difference[prop]).map((key) => <li key={key}>{prefix} {key} ({difference[prop][key]}x)</li>);

  return (
    <div className={styles.List}>
      <ul className={styles.extra}>{renderToolsNotUsed('+', 'extra')}</ul>
      <ul className={styles.missing}>{renderToolsNotUsed('-', 'missing')}</ul>
    </div>
  );
}

export default ReferenceCompare;
