/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button } from 'antd';
import WorkflowData from '@components/WorkflowInput/WorkflowData';
import { Data, Ontology } from '@models/workflow/Workflow';

interface WorkflowDataListProps {
  /** The title of the component (i.e. Input/Output) */
  title: any;

  /** The data ontology */
  dataOntology: Ontology;

  /** List of the data */
  dataList: Data[];

  /**
   * OnChange function for the data entry
   * @param index - the index of the entry in the data list
   * @param newInput - the data that should replace it
   */
  onChange: (index: number, output: Data) => void;

  /** OnAdd function for the add entry button */
  onAdd: () => void;

  /**
   * OnRemove function to delete a data entry
   * @param index - the index of the entry in the data list
   */
  onRemove: (id: number) => void;
}

/**
 * Inputs for defining the input or output of workflows
 */
function WorkflowDataList(props: WorkflowDataListProps) {
  const { title, dataOntology, dataList, onChange, onAdd, onRemove } = props;

  return (
    <div className="DataList" id={title}>
      <div style={{
        maxHeight: '70vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        paddingRight: '24px',
        marginBottom: '5px',
      }}
      >
        {
          dataList.map((data: Data, index: number) => (
            <WorkflowData
              title={title}
              key={index.toString()}
              dataOntology={dataOntology}
              data={data}
              index={index}
              onChange={onChange}
              onRemove={onRemove}
            />
          ))
        }
      </div>
      <Button
        type="default"
        shape="round"
        onClick={onAdd}
        disabled={dataOntology.roots.length === 0}
        style={{ display: 'inline-flex' }}
      >+ Add
      </Button>
    </div>
  );
}

export default WorkflowDataList;
