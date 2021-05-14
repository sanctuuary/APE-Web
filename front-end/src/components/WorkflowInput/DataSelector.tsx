/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import OntologyTreeSelect from '@components/WorkflowInput/OntologyTreeSelect';
import { Data, Ontology } from '@models/workflow/Workflow';
import styles from './DataSelector.module.scss';

/** Props interface for {@link DataSelector} */
interface DataSelectorProps {
  /** The data ontology */
  dataOntology: Ontology;
  /** The current data selected */
  data: Data;
  /** The onChange function to call back a value change */
  onChange: (value: Data) => void;
}

/** A component with a {@link OntologyTreeSelect} to be altered for data */
function DataSelector(props: DataSelectorProps) {
  const { dataOntology, data, onChange } = props;

  /**
   * Return a class name based on the index, so the styling is alternated
   * @return 'Light' if the index is even, otherwise 'Dark'.
   */
  const getClassName = (index) => (index % 2 === 0 ? 'Light' : 'Dark');

  return (
    <div>
      {
        dataOntology.roots.map((root, index) => (
          <label key={root.label} style={{ display: 'flex' }}>
            <div className={styles[getClassName(index)]}>
              {root.label}:
            </div>
            <OntologyTreeSelect
              ontology={root}
              value={data.values[index]}
              setValue={(value: { label: string; type: string, id: string }) => {
                data.values[index] = value;
                onChange(data);
              }}
              placeholder={`Select ${root.label}`}
            />
          </label>
        ))
      }
    </div>
  );
}

export default DataSelector;
