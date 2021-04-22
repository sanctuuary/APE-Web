/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import { Button, Divider, Row, Col } from 'antd';
import { Data, Ontology } from '@models/workflow/Workflow';
import DataSelector from '@components/WorkflowInput/DataSelector';

/**
 * The props for the {@link WorkflowData} component
 */
interface WorkflowDataProps {
  /** The title of the component (i.e. Input/Output) */
  title: string;

  /** The data that will be shown in this component */
  data: Data;

  /**
   * The index of the data in the data list in {@link WorkflowDataList}.
   */
  index: number;

  /** The data ontology */
  dataOntology: Ontology;

  /**
   * OnChange function for constraints
   * @param index - the index of the data in the data list
   * @param data - the data that should replace it
   */
  onChange: (index: number, data: Data) => void;

  /**
   * OnRemove function to delete this data
   * @param index - the index of the data in the data list
   */
  onRemove: (index: number) => void;
}

/**
 * A data selector component.
 *
 * @param {props} props - Object containing the data ontology, the data value,
 * its index and the onChange and onRemove functions.
 * @return {HTMLElement} Returns a div with a {@link DataSelector} and an
 * remove button.
 */
function WorkflowData(props: WorkflowDataProps) {
  const { title,
    data,
    index,
    dataOntology,
    onChange,
    onRemove } = props;

  return (
    <div id={`${title}${index}`}>
      <Row>
        <Col span={21}>
          <DataSelector
            dataOntology={dataOntology}
            data={data}
            onChange={(value: Data) => onChange(index, value)}
          />
        </Col>

        <Col span={3}>
          <Button
            style={{ marginLeft: '0', height: '100%' }}
            className="delete"
            type="ghost"
            onClick={() => onRemove(index)}
          >
            <strong style={{ fontSize: '16px' }}>-</strong>
          </Button>
        </Col>

      </Row>
      <Divider />
    </div>
  );
}

export default WorkflowData;
