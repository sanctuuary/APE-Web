/*
 * This program has been developed by students from the bachelor Computer Science at
 * Utrecht University within the Software Project course.
 *
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */

import React from 'react';
import OntologyTreeSelect from '@components/WorkflowInput/OntologyTreeSelect';
import { Tool, Ontology } from '@models/workflow/Workflow';

/**
 * Props interface for {@link ToolSelector}
 */
interface ToolSelectorProps {
  /** The tool ontology */
  toolOntology: Ontology;
  /** The current tool selected */
  tool: Tool;
  /** The onChange function to call back a value change */
  onChange: (value: Tool) => void;
}

/** A component with a {@link OntologyTreeSelect} to be altered for tools */
function ToolSelector(props: ToolSelectorProps) {
  const { toolOntology, tool, onChange } = props;

  // There is only 1 root in the toolOntology
  const root = toolOntology.roots[0];

  return (
    <div>
      <OntologyTreeSelect
        ontology={root}
        value={tool}
        setValue={onChange}
        placeholder={`Select ${root.label}`}
      />
    </div>
  );
}

export default ToolSelector;
