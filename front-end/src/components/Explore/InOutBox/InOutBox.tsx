/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Card } from 'antd';
import WorkflowDataList from '@components/WorkflowInput/WorkflowDataList';
import { Data, Ontology } from '@models/workflow/Workflow';
import TooltipIcon from '@components/TooltipIcon/TooltipIcon';
import styles from '@components/Explore/Box.module.less';

/**
 * The props for the {@link InOutBox} component
 */
interface InOutBoxProps {
  /** List of data types and their options */
  dataOntology: Ontology;

  /**
   * OnChange function for the data entry
   * @param index - the index of the entry in the data list
   * @param newInput - the data that should replace it
   */
  onChange: (index: number, newInput: Data) => void;

  /** OnAdd function for the add entry button */
  onAdd: () => void;

  /**
   * OnRemove function to delete a data entry
   * @param index - the index of the entry in the data list
   */
  onRemove: (index: number) => void;

  /** List of the data */
  inOuts: Data[];

  /** The title of the component (i.e. Input/Output) */
  title: string;

  /** The header text for the Ant Design Card */
  headerText: string;
  /** The tooltip to provide in the box' header */
  tooltip: string;
  /** Function to clear all workflow data. */
  clearWorkflowData: () => void;
}

/**
 * Card with input fields for defining either the workflow input or output.
 *
 * Wrapper around {@link WorkflowDataList}.
 */
function InOutBox(props: InOutBoxProps) {
  const {
    dataOntology,
    onChange,
    onAdd,
    onRemove,
    inOuts,
    title,
    headerText,
    tooltip,
    clearWorkflowData,
  } = props;

  return (
    <div className={styles.Box}>
      <Card
        title={headerText}
        style={{ minWidth: 350, width: '100%' }}
        headStyle={{ background: '#F1634C' }}
        bodyStyle={{ paddingRight: 0 }}
        extra={
          <TooltipIcon content={tooltip} />
        }
      >
        <WorkflowDataList
          title={title}
          dataOntology={dataOntology}
          dataList={inOuts}
          onChange={onChange}
          onAdd={onAdd}
          onRemove={onRemove}
          clearWorkflowData={clearWorkflowData}
        />
      </Card>
    </div>
  );
}

export default InOutBox;
